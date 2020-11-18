const Discord = require("discord.js");

import { defaultCooldown, prefix } from "./config.json";
import { lobbyObserver } from "./strings/embeds";
import { badArguments, onlyForGuildCommand } from "./strings/logsMessages";

export const parseCommand = (message) => {
    const validCommand = isCommand(message);

    if (!validCommand) {
        return {
            valid: false,
        };
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    return {
        valid: validCommand,
        commandName: args.shift().toLowerCase(),
        args: [...args.map((arg) => arg.toLowerCase())],
    };
};

export const isCommand = (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return false;
    return true;
};

export const logError = (message, error, msgToUser, type = false) => {
    console.log("================ ERROR START ================");
    console.error(error);
    type && message.reply(msgToUser || error.message);
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
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;

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
    // if undefined just return with nothing
    if (!command) {
        return false;
    }
    // if no args and args was required
    if (command.args && command.args !== args.length) {
        return badArguments(prefix, command.name, command.usage);
    }
    // if command need to be used only in channels
    if (command.guildOnly && message.channel.type === "dm") {
        return onlyForGuildCommand;
    }
    // No errors
    return false;
};

export const parseGameListToEmbed = (gamelist) => {
    const embeds = gamelist.map((game) => lobbyObserver(game));
    return embeds;
};

export const lookingForLobbyGame = (message) => {};
