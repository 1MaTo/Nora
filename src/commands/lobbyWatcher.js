const Discord = require("discord.js");
import { logError } from "../../dist/utils";
import { lobbyWatcher } from "../bot";
import { logsForUsers } from "../config.json";
import { getLobby } from "../db/db";
import { dbErrors, lobbyWatcherCommand } from "../strings/logsMessages";
import { autodeleteMsg, parseGameListToEmbed } from "../utils";

module.exports = {
    name: "lobbywatcher",
    args: 0,
    usage: `<[channel] [delay in ms]>\` | \`<stop>\`\n delay: min - 3000, max - 60000, default - 10000\``,
    description:
        "Frequently looking for games in real time until you stop this command",
    guildOnly: true,
    adminOnly: false,
    development: false,
    run: (message, args) => {
        if (args[0] === "stop") {
            const isWatching = lobbyWatcher.has(message.guild.id);
            if (isWatching) {
                const messages = lobbyWatcher.get(message.guild.id);
                messages.forEach((msg) => msg.delete());
                lobbyWatcher.delete(message.guild.id);
                return autodeleteMsg(
                    message,
                    lobbyWatcherCommand.stopedWathing
                );
            } else {
                return autodeleteMsg(
                    message,
                    lobbyWatcherCommand.nothingToStop
                );
            }
        }
        const channel = args[0]
            ? message.client.channels.cache.get(
                  args[0].replace(/[#<>]/g, "")
              ) || message.channel
            : message.channel;
        const delay = !isNaN(args[1])
            ? args[1] >= 3000 && args[1] <= 60000
                ? args[1]
                : 10000
            : 10000;
        const guild = lobbyWatcher.get(message.guild.id);
        if (guild) {
            return autodeleteMsg(
                message,
                lobbyWatcherCommand.alreadyWatchingInThisGuild
            );
        } else {
            autodeleteMsg(
                message,
                lobbyWatcherCommand.startWatching(channel.id, delay)
            );
            startWatching(message, channel, delay);
        }
    },
};

const startWatching = (message, channel, delay) => {
    getLobby((result, error) => {
        if (error) {
            return logError(
                message,
                new Error(error),
                dbErrors.queryError,
                logsForUsers.db
            );
        } else {
            const messages = new Discord.Collection();
            const guildId = message.guild.id;
            const headerContent = lobbyWatcherCommand.lobbiesCount(
                result ? result.length : 0
            );
            const lobbies = result ? getContentForLobbies(result) : [];
            channel
                .send(headerContent)
                .then((headerMessage) => messages.set("header", headerMessage))
                .then((_) => {
                    lobbies.forEach((game) => {
                        channel
                            .send({ embed: game.embed })
                            .then((embedMessage) =>
                                messages.set(game.botid, embedMessage)
                            );
                    });
                    lobbyWatcher.set(guildId, messages);
                    setTimeout(
                        () => updateLobbyWatcher(guildId, channel, delay),
                        delay
                    );
                });
        }
    });
};

const getContentForLobbies = (result) =>
    parseGameListToEmbed(result).map((game) => {
        return { botid: game.botid, embed: game.embed };
    });

const updateLobbyWatcher = (guildId, channel, delay) => {
    if (!lobbyWatcher.has(guildId)) return;
    getLobby((result, error) => {
        if (error) {
            return logError(
                message,
                new Error(error),
                dbErrors.queryError,
                logsForUsers.db
            );
        } else {
            try {
                const messages = lobbyWatcher.get(guildId);
                const headerMessage = messages.get("header");
                const headerContent = lobbyWatcherCommand.lobbiesCount(
                    result ? result.length : 0
                );
                const lobbies = result ? getContentForLobbies(result) : [];
                headerMessage.edit(headerContent);

                //  DELETE OUTDATED GAMES THAT HAVE END OR START
                messages.forEach((msg, botid) => {
                    if (!lobbies.some(game => game.botid === botid) && botid !== 'header') {
                        msg.delete()
                            .then(_ => messages.delete(botid))
                    }
                })
                lobbies.forEach((game) => {
                    const existLobbyMessage = messages.get(game.botid);
                    if (existLobbyMessage) {
                        existLobbyMessage.edit({ embed: game.embed });
                    } else {
                        headerMessage.channel
                            .send({ embed: game.embed })
                            .then((newLobbyMessage) => {
                                messages.set(game.botid, newLobbyMessage);
                                lobbyWatcher.set(guildId, messages);
                            });
                    }
                });
                setTimeout(() => updateLobbyWatcher(guildId, channel, delay), delay);
            } catch (err) {
                //console.log(err)
                console.log("Bad end in update");
            }
        }
    });
};
