import { notificationsPerGuild } from "../bot";
import { notificationJoinCommand } from "../strings/logsMessages";
import { autodeleteMsg } from "../utils";
const Discord = require("discord.js");

module.exports = {
    name: "notificationJoin",
    args: 1,
    aliases: ["nj"],
    usage: "<gameid>",
    description: "Use this command when someone start notifications to subscribe. When game will be set or overcrowded I'll ping you",
    guildOnly: true,
    development: false,
    adminOnly: false,
    run: (message, args) => {
        const notifications = notificationsPerGuild.get(message.guild.id) || new Discord.Collection();
        const currGamesUnsubscribed = getGamesWithId(args[0], message.author.id, message.guild.id);
        if (!currGamesUnsubscribed.length)
            return autodeleteMsg(message, `${notificationJoinCommand.undefinedGameId} **OR** ${notificationJoinCommand.alreadySubscribed}`);
        currGamesUnsubscribed.forEach(key => {
            const notification = notifications.get(key);
            notification.usersToPing.push(`<@${message.author.id}>`);
        });
        autodeleteMsg(message, notificationJoinCommand.subscribed);
    },
};

const getGamesWithId = (gameid, userToSubscribe, guildId) => {
    const games = [];
    const notifications = notificationsPerGuild.get(guildId) || new Discord.Collection();
    notifications.forEach((data, key) => {
        if (data.gameid === gameid) {
            if (!data.usersToPing.some(user => user === `<@${userToSubscribe}>`)) {
                games.push(key);
            }
        }
    });
    return games;
};
