const Discord = require("discord.js");
import { notificationsPerGuild } from "../bot";
import { notificationJoinCommand } from "../strings/logsMessages";
import { autodeleteMsg } from "../utils";

module.exports = {
    name: "notificationLeave",
    args: 1,
    aliases: ["nl"],
    usage: "<gameid>",
    description: "Use this command to unsubscribe from ping when game will be set",
    guildOnly: true,
    development: false,
    adminOnly: false,
    run: (message, args) => {
        const notifications = notificationsPerGuild.get(message.guild.id) || new Discord.Collection();
        const currGamesSubscribed = getGamesWithId(args[0], message.author.id, message.guild.id);
        if (!currGamesSubscribed.length)
            return autodeleteMsg(message, `${notificationJoinCommand.undefinedGameId} **OR** ${notificationJoinCommand.nothingToUnsubscribe}`);
        currGamesSubscribed.forEach(key => {
            const notification = notifications.get(key);
            const userIndex = notification.usersToPing.findIndex(user => user === `<@${message.author.id}>`);
            notification.usersToPing.splice(userIndex, 1);
        });
        autodeleteMsg(message, notificationJoinCommand.unsubscribed);
    },
};

const getGamesWithId = (gameid, userToUnsubscribe, guildId) => {
    const games = [];
    const notifications = notificationsPerGuild.get(guildId) || new Discord.Collection();
    notifications.forEach((data, userId) => {
        if (data.gameid === gameid) {
            if (data.usersToPing.some(user => user === `<@${userToUnsubscribe}>`)) {
                games.push(userId);
            }
        }
    });
    return games;
};
