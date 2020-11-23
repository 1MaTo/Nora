import { getLobbyPlayersCount } from "../db/db";
import { logsForUsers } from "../../config.json";
import { dbErrors, needPlayerCommand } from "../strings/logsMessages";
import { autodeleteMsg, checkValidChannel, checkValidRole, logError } from "../utils";
import { notifications } from "../bot";

module.exports = {
    name: "needplayer",
    args: 3,
    aliases: ["np"],
    usage: "<game id> <players count for game> <delay (minutes)> [channel] [role]",
    description: "Select game id,number of players, delay, channel and role to enable notifications in chat",
    guildOnly: true,
    development: false,
    adminOnly: false,
    stop: 'stop',
    run: (message, args) => {
        if (args[0] === 'stop') {
            notifications.delete(message.author.id)
            return autodeleteMsg(message, needPlayerCommand.stopNotifications)
        }
        if (notifications.has(message.author.id)) return autodeleteMsg(message, needPlayerCommand.notificationAlreadyRunning)
        const gameid = args[0]
        const totalPlayers = args[1]
        if (isNaN(totalPlayers)) return autodeleteMsg(message, needPlayerCommand.badPlayersCount)
        const delay = args[2]
        if (isNaN(delay)) return autodeleteMsg(message, needPlayerCommand.badDelay)
        if (delay < 1) return autodeleteMsg(message, needPlayerCommand.minDelay(1))
        const channel = checkValidChannel(args[3], message)
        const roleToPing = checkValidRole(args[4], message)
        getLobbyPlayersCount(gameid, (game, error) => {
            if (error) {
                autodeleteMsg(message, needPlayerCommand.noSuchGameInLobby)
                return logError(
                    message,
                    new Error(error),
                    dbErrors.queryError,
                    logsForUsers.db
                );
            } else {
                autodeleteMsg(message, needPlayerCommand.startNotifications)
                notifications.set(message.author.id, message.author.id)
                setTimeout(() => startNotificationSpam(gameid, message.author.id, totalPlayers, delay * 1000 * 60, channel, roleToPing), delay * 1000 * 60)
        }})
    }
};

const startNotificationSpam = (gameId, userId, totalPlayers, delay, channel, roleToPing) => {
    if (!notifications.has(userId)) return;
    getLobbyPlayersCount(gameId, (game, error) => {
        if (error) {
            autodeleteMsg({ channel: channel }, needPlayerCommand.noSuchGameInLobby)
            autodeleteMsg({ channel: channel }, needPlayerCommand.stopNotifications)
            notifications.delete(userId)
            return logError(
                message,
                new Error(error),
                dbErrors.queryError,
                logsForUsers.db
            );
        } else {
            const playerCount = totalPlayers - game.totalplayers
            if (playerCount === 0) {
                channel.send(needPlayerCommand.gameSet(game.gamename, roleToPing))
                notifications.delete(userId)
                return channel.send(needPlayerCommand.stopNotifications)
            }
            if (playerCount < 0) 
                return channel.send(needPlayerCommand.gameOverSet(game.gamename, Math.abs(playerCount), roleToPing))
            channel.send(needPlayerCommand.notification(game.gamename, playerCount, roleToPing))
                .then(_ => setTimeout(() => startNotificationSpam(gameId, userId, totalPlayers, delay, channel, roleToPing), delay))
    }})
}