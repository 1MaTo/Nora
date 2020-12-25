const Discord = require("discord.js");
import { getLobbyPlayersCount } from "../db/db";
import { fbtSettings } from "../../config.json";
import { dbErrors, needPlayerCommand } from "../strings/logsMessages";
import { autodeleteMsg, checkValidChannel, checkValidRole, logError } from "../utils";
import { notificationsPerGuild } from "../bot";
import { countPlayersInLobby } from "../db/utils";

module.exports = {
    name: "needplayer",
    args: 2,
    aliases: ["np"],
    usage: "<game id> <players count for game> [delay (minutes)] [channel] [role] | <stop>",
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
        let reCreate = false;
        if (notifications.has(message.author.id)) {
            autodeleteMsg(message, needPlayerCommand.recreateNotification, 1000);
            reCreate = true;
        }
        const gameid = args[0];
        const notificationsForThisGame = [];
        notifications.forEach((value, key) => {
            if (value.gameid === gameid && message.author.id !== key) notificationsForThisGame.push(key);
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
                return logError(message, new Error(error), dbErrors.queryError, fbtSettings.db);
            } else {
                const notifOptions = {
                    timeToken: Date.now(),
                    gameid: gameid,
                    auhtorId: message.author.id,
                    totalPlayers: totalPlayers,
                    delay: delay * 1000 * 60,
                    channel: channel,
                    roleToPing: roleToPing,
                    msgs: [],
                    usersToPing: [],
                };
                if (reCreate) {
                    const pastNotifData = notifications.get(message.author.id);
                    notifications.set(message.author.id, {
                        ...notifOptions,
                        channel: args.length >= 4 ? notifOptions.channel : pastNotifData.channel,
                        roleToPing: args.length >= 5 ? notifOptions.roleToPing : pastNotifData.roleToPing,
                        delay: args.length >= 3 ? notifOptions.delay : pastNotifData.delay,
                        usersToPing: pastNotifData.usersToPing,
                        msgs: pastNotifData.msgs,
                    });
                    notificationsPerGuild.set(message.guild.id, notifications);
                    setTimeout(
                        () => startNotificationSpam(notifOptions.timeToken, message.guild.id, message.author.id, notifOptions.channel),
                        notifOptions.delay
                    );
                } else {
                    autodeleteMsg(message, needPlayerCommand.startNotifications);
                    autodeleteMsg(message, needPlayerCommand.tipsForSub(gameid));
                    notifications.set(message.author.id, { ...notifOptions });
                    notificationsPerGuild.set(message.guild.id, notifications);
                    setTimeout(
                        () => startNotificationSpam(notifOptions.timeToken, message.guild.id, message.author.id, notifOptions.channel),
                        notifOptions.delay
                    );
                }
            }
        });
    },
};

const startNotificationSpam = (token, guildId, authorId, channel) => {
    const notifications = notificationsPerGuild.get(guildId);
    if (!notifications) return endNotifications(channel, authorId);
    const notifData = notifications.get(authorId);
    if (!notifData) return endNotifications(channel, authorId);
    // Return if notifications reacreated
    if (notifData.timeToken !== token) return;
    const { gameid, totalPlayers, delay, roleToPing, usersToPing, msgs } = notifData;
    getLobbyPlayersCount(gameid, async (game, error) => {
        if (error) {
            autodeleteMsg({ channel: channel }, needPlayerCommand.noSuchGameInLobby);
            logError({ channel: channel }, new Error(error), dbErrors.queryError, fbtSettings.db);
            return endNotifications(channel, authorId);
        } else {
            try {
                const playersInLobby = await countPlayersInLobby(channel.guild.id, game.usernames, game.map, game.slotstaken, game.slotstotal);
                const playerCount = totalPlayers - playersInLobby;
                if (playerCount === 0) {
                    channel.send(needPlayerCommand.gameSet(gameid, game.gamename, roleToPing, usersToPing.join(" ")));
                    return endNotifications(channel, authorId);
                }
                if (playerCount < 0) {
                    channel.send(needPlayerCommand.gameOverSet(gameid, game.gamename, Math.abs(playerCount), roleToPing, usersToPing.join(" ")));
                    return endNotifications(channel, authorId);
                }
                channel.send(needPlayerCommand.notification(gameid, game.gamename, playerCount, roleToPing)).then(message => {
                    msgs.push(message);
                    setTimeout(() => startNotificationSpam(token, guildId, authorId, channel), delay);
                });
            } catch (error) {
                logError({ channel: channel }, error, needPlayerCommand.smthWrong, fbtSettings.failedInCommand);
                return endNotifications(channel, authorId);
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
