const Discord = require("discord.js");
import { autodeleteMsgDelay, defaultCooldown, prefix } from "../config.json";
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

export const parseUserId = string => string.replaceAll(/[<>@!]/g, "");
