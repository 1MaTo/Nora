const Discord = require("discord.js");
import { fbtSettings } from "../../config.json";
import { lobbyWatcher } from "../bot";
import { getLobby } from "../db/db";
import { objectKey } from "../redis/objects";
import { redis } from "../redis/redis";
import { dbErrors, lobbyWatcherCommand } from "../strings/logsMessages";
import {
    autodeleteMsg,
    changeBotStatus,
    checkValidChannel,
    guildRedisKey,
    logError,
    parseGameListToEmbed,
    sendReportToOwner,
} from "../utils";

export const name = "lobbywatcher";
export const aliases = ["lw"];
export const args = 0;
export const usage = `[channel | stop] [delay in ms]`;
export const description =
    "Frequently looking for games in real time until you stop this command\ndelay: min - 3000, max - 60000, default - 10000";
export const guildOnly = true;
export const adminOnly = false;
export const development = true;
export const run = async (message, args) => {
    try {
        if (args[0] === "stop") {
            const isWatching = lobbyWatcher.has(message.guild.id);
            if (isWatching) {
                const messages = lobbyWatcher.get(message.guild.id);
                messages.forEach(msg => msg.delete());
                await clearLobbyMessagesData(message.guild.id);
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
        sendReportToOwner(error);
        console.log(error);
    }
};

const startWatching = async (message, channel, delay) => {
    getLobby(message.guild.id, async (result, error) => {
        if (error) {
            await clearLobbyMessagesData(guildId);
            sendReportToOwner(error);
            return logError(message, new Error(error), dbErrors.queryError, fbtSettings.db);
        } else {
            try {
                const loadedLobbies = await result;
                const messages = new Discord.Collection();
                const timers = new Discord.Collection();
                const guildId = message.guild.id;
                const headerContent = lobbyWatcherCommand.lobbiesCount(loadedLobbies ? loadedLobbies.length : 0);
                const lobbies = loadedLobbies ? getContentForLobbies(loadedLobbies, timers) : [];
                const headerMessage = await channel.send(headerContent);
                messages.set("header", headerMessage);
                await Promise.all(
                    lobbies.map(async game => {
                        const embedMessage = await channel.send({ embed: game.embed });
                        messages.set(game.botid, embedMessage);
                    })
                );
                lobbyWatcher.set(guildId, messages);
                await setLobbyMessagesData(guildId, channel.id, messages, delay, timers);
                setTimeout(() => updateLobbyWatcher(guildId, channel, delay, timers), delay);
            } catch (error) {
                await clearLobbyMessagesData(guildId);
                console.log(error);
                sendReportToOwner(error);
            }
        }
    });
};

const getContentForLobbies = (result, timers) =>
    parseGameListToEmbed(result, timers).map(game => {
        return { botid: game.botid, embed: game.embed };
    });

export const updateLobbyWatcher = async (guildId, channel, delay, pastTimers) => {
    if (!lobbyWatcher.has(guildId)) return;
    getLobby(guildId, async (result, error) => {
        if (error) {
            await clearLobbyMessagesData(guildId);
            sendReportToOwner(error);
            return logError(message, new Error(error), dbErrors.queryError, fbtSettings.db);
        } else {
            try {
                const loadedLobbies = await result;
                const messages = lobbyWatcher.get(guildId);
                const timers = pastTimers ? pastTimers : new Discord.Collection();
                let headerMessage = messages.get("header");
                const headerContent = lobbyWatcherCommand.lobbiesCount(loadedLobbies ? loadedLobbies.length : 0);
                //changeBotStatus({ lobby: loadedLobbies ? loadedLobbies.length : 0 });
                const lobbies = loadedLobbies ? getContentForLobbies(loadedLobbies, timers) : [];

                try {
                    await headerMessage.edit(headerContent);
                } catch (err) {
                    headerMessage = await channel.send(headerContent);
                    messages.set("header", headerMessage);
                }

                //  DELETE OUTDATED GAMES THAT HAVE END OR START
                await Promise.all(
                    messages.map(async (msg, botid) => {
                        if (!lobbies.some(game => game.botid === botid) && botid !== "header") {
                            timers.delete(botid);
                            await msg.delete();
                            messages.delete(botid);
                        }
                    })
                );

                await Promise.all(
                    lobbies.map(async game => {
                        const existLobbyMessage = messages.get(game.botid);
                        if (existLobbyMessage) {
                            try {
                                await existLobbyMessage.edit({ embed: game.embed });
                            } catch (error) {
                                const newLobbyMessage = await headerMessage.channel.send({ embed: game.embed });
                                messages.set(game.botid, newLobbyMessage);
                            }
                        } else {
                            const newLobbyMessage = await headerMessage.channel.send({ embed: game.embed });
                            messages.set(game.botid, newLobbyMessage);
                        }
                    })
                );
                await setLobbyMessagesData(guildId, channel.id, messages, delay, timers);
                setTimeout(() => updateLobbyWatcher(guildId, channel, delay, timers), delay);
            } catch (error) {
                sendReportToOwner(error);
                console.log("Bad end in update");
            }
        }
    });
};

const setLobbyMessagesData = async (guildId, channelId, messages, delay, timers) => {
    const redisKey = guildRedisKey.struct(objectKey.lobbyWatcher, guildId);
    const msgIds = [...messages.entries()].map(([key, msg]) => {
        return { key: key, id: msg.id };
    });
    await redis.set(redisKey, {
        channel: channelId,
        messages: [...msgIds],
        delay,
        timers: [...timers.entries()],
    });
};

const clearLobbyMessagesData = async guildId => {
    const redisKey = guildRedisKey.struct(objectKey.lobbyWatcher, guildId);
    await redis.del(redisKey);
    lobbyWatcher.delete(guildId);
};
