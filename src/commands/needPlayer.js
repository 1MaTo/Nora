const Discord = require("discord.js");
import { getLobbyPlayersCount } from "../db/db";
import { logsForUsers } from "../../config.json";
import { dbErrors, needPlayerCommand } from "../strings/logsMessages";
import { autodeleteMsg, checkValidChannel, checkValidRole, logError } from "../utils";
import { notificationsPerGuild } from "../bot";
import { countPlayersInLobby } from "../db/utils";

module.exports = {
    name: "needplayer",
    args: 2,
    aliases: ["np"],
    usage: "<game id> <players count for game> [delay (minutes)] [channel] [role]\n<stop>",
    description: "Select game id,number of players, delay, channel and role to enable notifications in chat",
    guildOnly: true,
    development: false,
    adminOnly: false,
    stop: "stop",
    run: (message, args) => {
        const notifications = notificationsPerGuild.get(message.guild.id) || new Discord.Collection();
        if (args[0] === "stop") {
            const notificationsData = notifications.get(message.author.id);
            if (notificationsData) {
                return endNotifications(notificationsData.channel, message.author.id, message);
            } else {
                return autodeleteMsg(message, needPlayerCommand.nothingToStop);
            }
        }
        if (notifications.has(message.author.id)) {
            const notificationsData = notifications.get(message.author.id);
            endNotifications(notificationsData.channel, message.author.id, message);
            autodeleteMsg(message, needPlayerCommand.recreateNotification);
        }
        const gameid = args[0];
        const notificationsForThisGame = [];
        notifications.forEach((value, key) => {
            if (value.gameid === gameid) notificationsForThisGame.push(key);
        });
        if (notificationsForThisGame.length) return autodeleteMsg(message, needPlayerCommand.onlyOneNotificationForGame);
        const totalPlayers = args[1];
        if (isNaN(totalPlayers)) return autodeleteMsg(message, needPlayerCommand.badPlayersCount);
        const delay = args[2] || 1;
        if (isNaN(delay)) return autodeleteMsg(message, needPlayerCommand.badDelay);
        if (delay < 1) return autodeleteMsg(message, needPlayerCommand.minDelay(1));
        const channel = checkValidChannel(args[3], message);
        const roleToPing = checkValidRole(args[4], message);
        getLobbyPlayersCount(gameid, (game, error) => {
            if (error) {
                autodeleteMsg(message, needPlayerCommand.noSuchGameInLobby);
                return logError(message, new Error(error), dbErrors.queryError, logsForUsers.db);
            } else {
                autodeleteMsg(message, needPlayerCommand.startNotifications);
                autodeleteMsg(message, needPlayerCommand.tipsForSub(gameid));
                notifications.set(message.author.id, { channel: channel, gameid: gameid, msgs: [], usersToPing: [] });
                notificationsPerGuild.set(message.guild.id, notifications);
                setTimeout(() => startNotificationSpam(gameid, message.author.id, totalPlayers, delay * 1000 * 60, channel, roleToPing), delay * 1000 * 60);
            }
        });
    },
};

const startNotificationSpam = (gameId, userId, totalPlayers, delay, channel, roleToPing) => {
    const notifications = notificationsPerGuild.get(channel.guild.id);
    const notifMsgs = notifications.get(userId);
    if (!notifMsgs) return endNotifications(channel, userId);
    getLobbyPlayersCount(gameId, (game, error) => {
        if (error) {
            autodeleteMsg({ channel: channel }, needPlayerCommand.noSuchGameInLobby);
            logError({ channel: channel }, new Error(error), dbErrors.queryError, logsForUsers.db);
            return endNotifications(channel, userId);
        } else {
            try {
                const playerCount = totalPlayers - countPlayersInLobby(game.map, game.slotstaken, game.slotstotal);
                if (playerCount === 0) {
                    channel.send(needPlayerCommand.gameSet(gameId, game.gamename, roleToPing, notifMsgs.usersToPing.join(" ")));
                    return endNotifications(channel, userId);
                }
                if (playerCount < 0) {
                    channel.send(needPlayerCommand.gameOverSet(gameId, game.gamename, Math.abs(playerCount), roleToPing, notifMsgs.usersToPing.join(" ")));
                    return endNotifications(channel, userId);
                }
                channel.send(needPlayerCommand.notification(gameId, game.gamename, playerCount, roleToPing)).then(message => {
                    notifMsgs.msgs.push(message);
                    setTimeout(() => startNotificationSpam(gameId, userId, totalPlayers, delay, channel, roleToPing), delay);
                });
            } catch (error) {
                logError({ channel: channel }, error, needPlayerCommand.smthWrong, logsForUsers.failedInCommand);
                return endNotifications(channel, userId);
            }
        }
    });
};

const endNotifications = (channel, userId, message) => {
    const notifications = notificationsPerGuild.get(channel.guild.id);
    const notifMsgs = notifications.get(userId);
    if (notifMsgs && notifMsgs.msgs) {
        channel.bulkDelete(notifMsgs.msgs).then(_ => {
            notifications.delete(userId);
            const messageToDelete = message || { channel: channel };
            autodeleteMsg(messageToDelete, needPlayerCommand.stopNotifications);
        });
    }
};
