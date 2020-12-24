import "@babel/polyfill";
import "core-js/stable";
import regeneratorRuntime from "regenerator-runtime";
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

import { onCooldown } from "./strings/logsMessages";
import { token } from "../auth.json";
import { fbtSettings } from "../config.json";
import { autodeleteMsg, checkCommandRequirements, checkCooldownTime, logError, parseCommand } from "./utils";

//  constant for builds
const production = process.env.NODE_ENV === "production";
const development = process.env.NODE_ENV === "development";
//  util map
export const utilmap = new Discord.Collection();
//  map of notifications for games
export const notificationsPerGuild = new Discord.Collection();
//  map of guilds configs
export const guilds = new Discord.Collection();
//  map of commands
client.commands = new Discord.Collection();
//	map of cooldowns
const cooldowns = new Discord.Collection();
//  map of lobbies comments to monitor
export const lobbyWatcher = new Discord.Collection();
// map of gameStatsCollectors
export const statsCollectors = new Discord.Collection()

//	loading commands to map
const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith("js"));

commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

client.once("ready", () => {
    console.log("================= SETTING UP =================");

    console.log("================= BOT ONLINE =================");
});

client.on("message", message => {
    const guildId = message.guild && message.guild.id;
    const userId = message.author && message.author.id;
    //  Skip this server in production build
    if (production && guildId === "556150178147467265") {
        return;
    }
    // Skip command if user in development send dm and not ME
    if (development && userId !== "245209137103896586") {
        return;
    }
    //  Skip all other servers in development build
    if (development && guildId !== "556150178147467265") {
        return;
    }
    //	get commands and args from message
    const { valid, commandName, args } = parseCommand(message);
    if (!valid) return false;

    const command =
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    //	if no such command in map just return
    if (!command) return logError(message, new Error("Undefined command"), fbtSettings.undefinedCommand);

    //	checking for any requirements in commands
    const badCommandRequirements = checkCommandRequirements(command, args, message);

    if (badCommandRequirements) {
        return autodeleteMsg(message, badCommandRequirements);
    }

    //	cooldowns
    const secondsLeft = checkCooldownTime(cooldowns, command, message);
    if (secondsLeft) return autodeleteMsg(message, onCooldown(secondsLeft, command.name));

    // finaly run command
    try {
        command.run(message, args);
    } catch (error) {
        logError(message, error, fbtSettings.failedInCommand);
    }
});

client.login(token);
