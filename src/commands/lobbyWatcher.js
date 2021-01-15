const Discord = require("discord.js");
import { checkGhostStatus, checkValidChannel, logError } from "../utils";
import { client, lobbyWatcher } from "../bot";
import { fbtSettings } from "../../config.json";
import { getLobby } from "../db/db";
import { dbErrors, lobbyWatcherCommand } from "../strings/logsMessages";
import { autodeleteMsg, parseGameListToEmbed } from "../utils";
import { botOwner } from "../../auth.json";

module.exports = {
    name: "lobbywatcher",
    aliases: ["lw"],
    args: 0,
    usage: `[channel | stop] [delay in ms]`,
    description:
        "Frequently looking for games in real time until you stop this command\ndelay: min - 3000, max - 60000, default - 10000",
    guildOnly: true,
    adminOnly: false,
    development: false,
    run: (message, args) => {
        try {
            if (args[0] === "stop") {
                const isWatching = lobbyWatcher.has(message.guild.id);
                if (isWatching) {
                    const messages = lobbyWatcher.get(message.guild.id);
                    messages.forEach(msg => msg.delete());
                    lobbyWatcher.delete(message.guild.id);
                    return autodeleteMsg(message, lobbyWatcherCommand.stopedWathing);
                } else {
                    return autodeleteMsg(message, lobbyWatcherCommand.nothingToStop);
                }
            }
            const channel = checkValidChannel(args[0], message);
            const delay = !isNaN(args[1]) ? (args[1] >= 3000 && args[1] <= 60000 ? args[1] : 10000) : 10000;
            const guild = lobbyWatcher.get(message.guild.id);
            if (guild) {
                return autodeleteMsg(message, lobbyWatcherCommand.alreadyWatchingInThisGuild);
            } else {
                autodeleteMsg(message, lobbyWatcherCommand.startWatching(channel.id, delay));
                startWatching(message, channel, delay);
            }
        } catch (error) {
            client.users.get(botOwner.id).send(`**CRASH**\n\`\`\`${error}\`\`\``);
        }
    },
};

const startWatching = (message, channel, delay) => {
    getLobby(message.guild.id, async (result, error) => {
        if (error) {
            lobbyWatcher.delete(guildId);
            client.users.get(botOwner.id).send(`**CRASH**\n\`\`\`${error}\`\`\``);
            return logError(message, new Error(error), dbErrors.queryError, fbtSettings.db);
        } else {
            try {
                const loadedLobbies = await result;
                const messages = new Discord.Collection();
                const timers = new Discord.Collection();
                const guildId = message.guild.id;
                const headerContent = lobbyWatcherCommand.lobbiesCount(loadedLobbies ? loadedLobbies.length : 0);
                const lobbies = loadedLobbies ? getContentForLobbies(loadedLobbies, timers) : [];
                channel
                    .send(headerContent)
                    .then(headerMessage => messages.set("header", headerMessage))
                    .then(_ => {
                        lobbies.forEach(game => {
                            channel
                                .send({ embed: game.embed })
                                .then(embedMessage => messages.set(game.botid, embedMessage));
                        });
                        lobbyWatcher.set(guildId, messages);
                        setTimeout(() => updateLobbyWatcher(guildId, channel, delay, timers), delay);
                    });
            } catch (error) {
                lobbyWatcher.delete(guildId);
                console.log(error);
                client.users.get(botOwner.id).send(`**CRASH**\n\`\`\`${error}\`\`\``);
            }
        }
    });
};

const getContentForLobbies = (result, timers) =>
    parseGameListToEmbed(result, timers).map(game => {
        return { botid: game.botid, embed: game.embed };
    });

const updateLobbyWatcher = (guildId, channel, delay, pastTimers) => {
    if (!lobbyWatcher.has(guildId)) return;
    getLobby(guildId, async (result, error) => {
        if (error) {
            lobbyWatcher.delete(guildId);
            client.users.get(botOwner.id).send(`**CRASH**\n\`\`\`${error}\`\`\``);
            return logError(message, new Error(error), dbErrors.queryError, fbtSettings.db);
        } else {
            try {
                const loadedLobbies = await result;
                const messages = lobbyWatcher.get(guildId);
                const timers = pastTimers ? pastTimers : new Discord.Collection();
                const headerMessage = messages.get("header");
                const headerContent = lobbyWatcherCommand.lobbiesCount(loadedLobbies ? loadedLobbies.length : 0);
                changeBotStatus({ lobby: loadedLobbies ? loadedLobbies.length : 0 });
                const lobbies = loadedLobbies ? getContentForLobbies(loadedLobbies, timers) : [];
                headerMessage.edit(headerContent);

                //  DELETE OUTDATED GAMES THAT HAVE END OR START
                messages.forEach((msg, botid) => {
                    if (!lobbies.some(game => game.botid === botid) && botid !== "header") {
                        timers.delete(botid);
                        msg.delete().then(_ => messages.delete(botid));
                    }
                });
                lobbies.forEach(game => {
                    const existLobbyMessage = messages.get(game.botid);
                    if (existLobbyMessage) {
                        existLobbyMessage.edit({ embed: game.embed });
                    } else {
                        headerMessage.channel.send({ embed: game.embed }).then(newLobbyMessage => {
                            messages.set(game.botid, newLobbyMessage);
                            lobbyWatcher.set(guildId, messages);
                        });
                    }
                });
                setTimeout(() => updateLobbyWatcher(guildId, channel, delay, timers), delay);
            } catch (error) {
                lobbyWatcher.delete(guildId);
                client.users.get(botOwner.id).send(`**CRASH**\n\`\`\`${error}\`\`\``);
                console.log("Bad end in update");
            }
        }
    });
};
