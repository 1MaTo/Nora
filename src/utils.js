const Discord = require("discord.js");
import axios from "axios";
import { botOwner, ghost } from "../auth.json";
import { autodeleteMsgDelay, defaultCooldown, prefix } from "../config.json";
import { BOT_GHOST_STATUS, client, development, lobbyWatcher, statsCollectors } from "./bot";
import { updateLobbyWatcher } from "./commands/lobbyWatcher";
import { checkNewFinishedGames } from "./commands/gameStats";
import { objectKey } from "./redis/objects";
import { redis } from "./redis/redis";
import { numberToEmoji } from "./strings/constants";
import { lobbyObserver } from "./strings/embeds";
import {
    badArguments,
    commandInDevelopment,
    needAdminPermission,
    onlyForDmCommand,
    onlyForGuildCommand,
} from "./strings/logsMessages";

export const parseCommand = message => {
    const validCommand = isCommand(message);

    if (!validCommand) {
        return {
            valid: false,
        };
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command =
        message.client.commands.get(commandName) ||
        message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    return {
        valid: validCommand,
        commandName,
        args: command && command.caseSensitive ? [...args] : [...args.map(arg => arg.toLowerCase())],
    };
};

export const isCommand = message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return false;
    return true;
};

export const logError = (message, error, msgToUser, type = false) => {
    console.log("================ ERROR START ================");
    console.error(error);
    type && autodeleteMsg(message, msgToUser || error.message);
    console.log("================ ERROR END ================");
};

export const checkCooldownTime = (cooldowns, command, message) => {
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || defaultCooldown) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return timeLeft;
        }
    } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        return false;
    }
};

export const checkCommandRequirements = (command, args, message) => {
    //  if undefined just return with nothing
    if (!command) {
        return false;
    }
    //  if dm only
    if (command.dmOnly && message.channel.type !== "dm") {
        return onlyForDmCommand;
    }
    //  if in development
    if (command.development && message.member.id !== "245209137103896586") {
        return commandInDevelopment;
    }
    //  if only for admins
    if (command.adminOnly && !message.member.hasPermission("ADMINISTRATOR")) {
        return needAdminPermission;
    }
    //  if command need to be used only in channels
    if (command.guildOnly && message.channel.type === "dm") {
        return onlyForGuildCommand;
    }
    //  if no args and args was required
    if (command.args && command.args > args.length && args[0] !== (command.stop || true)) {
        return badArguments(prefix, command.name, command.usage);
    }
    //  No errors
    return false;
};

export const parseGameListToEmbed = (gamelist, timers) => {
    return gamelist.map(game => {
        let gameTimer = timers.get(game.botid);
        if (!gameTimer) {
            const currDate = Date.now();
            timers.set(game.botid, currDate);
            gameTimer = currDate;
        }
        return lobbyObserver(game, gameTimer);
    });
};

export const autodeleteMsg = (message, content, milliseconds = null) => {
    message.channel.send(content).then(botMessage => {
        message.delete &&
            message.delete({ timeout: autodeleteMsgDelay }).catch(err => console.log("not permissions for delete"));
        botMessage
            .delete({ timeout: milliseconds || autodeleteMsgDelay })
            .catch(err => console.log("nothing to delete"));
    });
};

export const autodeleteReaction = (message, reaction, milliseconds = null) => {
    message.react(reaction).then(_ => {
        message
            .delete({ timeout: milliseconds || autodeleteMsgDelay })
            .catch(err => console.log("not permissions for delete"));
    });
};

export const checkValidChannel = (inputChannel, message) => {
    return inputChannel
        ? message.client.channels.cache.get(inputChannel.replace(/[#<>]/g, "")) || message.channel
        : message.channel;
};

export const checkValidRole = (inputRole, message) => {
    return inputRole ? message.guild.roles.cache.get(inputRole.replace(/[@&<>]/g, "")) || "" : "";
};

export const parseTimePast = startPoint => {
    const milliseconds = Date.now() - startPoint;
    var hours = milliseconds / (1000 * 60 * 60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : "0" + absoluteHours;

    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : "0" + absoluteMinutes;

    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : "0" + absoluteSeconds;

    return h + ":" + m + ":" + s;
};

export const parseDuration = duration => {
    var hours = duration / (1000 * 60 * 60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : "0" + absoluteHours;

    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : "0" + absoluteMinutes;

    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : "0" + absoluteSeconds;

    return h + ":" + m + ":" + s;
};

export const uniqueFromArray = array => array.filter((v, i, a) => a.indexOf(v) === i);

export const toFirstLetterUpperCase = string => string[0].toUpperCase() + string.substr(1);

export const guildUserRedisKey = {
    struct: (object, guildId, userId) => [object, guildId, userId].join("&&&"),
    destruct: key => key.split("&&&"),
};

export const guildRedisKey = {
    struct: (object, guildId) => [object, guildId].join("###"),
    destruct: key => key.split("###"),
};

export const parseUserId = string => string.replaceAll(/[<>@!]/g, "");

export const changeBotStatus = async status => {
    if (development) return;
    if (typeof status === "string") {
        return client.user.setActivity(status, {
            type: "PLAYING",
        });
    }
    Object.entries(BOT_GHOST_STATUS).forEach(([key, _]) => {
        if (status[key] !== undefined) BOT_GHOST_STATUS[key] = status[key];
    });
    if (typeof status === "object") {
        if (!BOT_GHOST_STATUS.ghost || BOT_GHOST_STATUS.ghost === "❌") {
            return client.user.setActivity(`Ghost: ❌`, {
                type: "PLAYING",
            });
        }
        return client.user.setActivity(
            `${BOT_GHOST_STATUS.ghost ? `Ghost ${BOT_GHOST_STATUS.ghost}` : "❌"} ${
                BOT_GHOST_STATUS.lobby
                    ? `| Lobby ${
                          Number(BOT_GHOST_STATUS.lobby) < 11
                              ? numberToEmoji[BOT_GHOST_STATUS.lobby]
                              : BOT_GHOST_STATUS.lobby
                      }`
                    : ""
            } ${
                BOT_GHOST_STATUS.games
                    ? `| Games ${
                          Number(BOT_GHOST_STATUS.games) < 11
                              ? numberToEmoji[BOT_GHOST_STATUS.games]
                              : BOT_GHOST_STATUS.games
                      }`
                    : ""
            }`,
            {
                type: "PLAYING",
            }
        );
    }
};

export const pause = time => new Promise(resolve => setTimeout(resolve, time));

export const checkGhostStatus = async (defaultTimeout = 1000 * 60 * 1) => {
    try {
        const commandUrl = `http://${ghost.host}:${ghost.port}/cmd?pass=${ghost.password}&cmd=${escape("ggs")}`;
        const chatUrl = `http://${ghost.host}:${ghost.port}/chat`;
        await axios.get(commandUrl);
        await pause(2000);
        const chat = await axios.get(chatUrl);
        const gamesString = chat.data
            .toString()
            .replace(/&nbsp;/g, " ")
            .replace(/<br>/g, "\n")
            .match(/\(\d+ today+\).*/g);
        if (gamesString) {
            const games = gamesString[gamesString.length - 1];
            const gameCount = games.match(/\#\d+:/g);
            changeBotStatus({ ghost: "✅", games: gameCount ? gameCount.length : null });
        } else {
            changeBotStatus({ ghost: "✅" });
        }
    } catch (error) {
        console.log(error);
        console.log("Ghost is offline");
        changeBotStatus({ ghost: "❌" });
    }
    setTimeout(() => checkGhostStatus(defaultTimeout), defaultTimeout);
};

export const getUserById = async (guild, id) => {
    try {
        const user = await guild.members.fetch({ user: id, cache: false });
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const sendReportToOwner = async message => {
    try {
        const owner = await client.users.fetch(botOwner.id, false);
        owner.send(`**REPORT**\n\`\`\`${message}\`\`\``);
    } catch (error) {
        console.log("Cant send msg to owner: ", error);
    }
};

export const loadLobbyWatchersFromDB = async () => {
    const guildIds = client.guilds.cache.map(guild => guild.id);
    try {
        await Promise.all(
            guildIds.map(async guildId => {
                const redisKey = guildRedisKey.struct(objectKey.lobbyWatcher, guildId);
                const data = await redis.get(redisKey);
                if (!data) return;
                const channel = await client.channels.fetch(data.channel);
                const messages = (
                    await Promise.all(
                        data.messages.map(async msg => {
                            try {
                                const fetchedMsg = await channel.messages.fetch(msg.id);
                                return [msg.key, fetchedMsg];
                            } catch (error) {
                                return null;
                            }
                        })
                    )
                ).filter(msg => msg !== null);
                lobbyWatcher.set(guildId, new Discord.Collection(messages));
                updateLobbyWatcher(guildId, channel, data.delay, new Discord.Collection(data.timers));
            })
        );
    } catch (error) {
        console.log(error);
        sendReportToOwner("Cant load lobby watchers: " + error);
    }
};

export const loadGameStatsFromDB = async () => {
    const guildIds = client.guilds.cache.map(guild => guild.id);
    try {
        await Promise.all(
            guildIds.map(async guildId => {
                const redisKey = guildRedisKey.struct(objectKey.gameStats, guildId);
                const data = await redis.get(redisKey);
                if (!data) return;
                const channel = await client.channels.fetch(data.channel);
                statsCollectors.set(guildId, { ...data, channel });
                checkNewFinishedGames(channel);
            })
        );
    } catch (error) {
        console.log(error);
        sendReportToOwner("Cant load lobby watchers: " + error);
    }
};

export const getWinrateColor = value => {
    var hue = ((value / 100) * 120).toString(10);
    return hslToHex(hue, 100, 40);
};

export const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};
