import "@babel/polyfill";
import "core-js/stable";
import { token } from "../auth.json";
import { fbtSettings } from "../config.json";
import { onCooldown } from "./strings/logsMessages";
import {
    autodeleteMsg,
    changeBotStatus,
    checkCommandRequirements,
    checkCooldownTime,
    checkGhostStatus,
    logError,
    parseCommand,
} from "./utils";
const Discord = require("discord.js");
const fs = require("fs");

export const client = new Discord.Client();

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
export const statsCollectors = new Discord.Collection();
// info for bot activity status
export const BOT_GHOST_STATUS = {
    ghost: undefined,
    lobby: undefined,
    games: undefined,
};

//	loading commands to map
const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith("js"));

commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name.toLowerCase(), command);
});

client.once("ready", async () => {
    console.log("================= SETTING UP =================");
    checkGhostStatus();
    console.log("================= BOT ONLINE =================");
    changeBotStatus("💤");
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
        client.users.get(botOwner.id).send(`**CRASH**\n\`\`\`${error}\`\`\``);
    }
});

client.login(token);

/*var dgram = require("dgram");
var port = 5868;

const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

const ghost = dgram.createSocket({ type: "udp4", reuseAddr: true });

ghost.send(Buffer.from("Some bytes"), 6969, "localhost", err => {
    console.log("send");
});

socket.on("message", function (msg, info) {
    console.log(msg.toString());
});

socket.on("error", err => {
    console.log(`socket error:\n${err.stack}`);
});

socket.bind({
    address: "localhost",
    port,
}); */
