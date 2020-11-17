const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

import { token } from "../auth.json";
import {
    isCommand,
    logError,
    parseCommand,
    checkCommandRequirements,
    checkCooldownTime,
} from "./utils";
import { logsForUsers } from "./config.json";
import { onCooldown } from "./strings/logsMessages";

//  map of commands
client.commands = new Discord.Collection();
//	map of cooldowns
const cooldowns = new Discord.Collection();

//	loading commands to map
const commandFiles = fs
    .readdirSync(__dirname + "/commands")
    .filter((file) => file.endsWith("js"));

commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

client.once("ready", () => {
    console.log("=========== BOT ONLINE ===========");
});

client.on("message", (message) => {
    //	get commands and args from message
    const { valid, commandName, args } = parseCommand(message);
    if (!valid) return false;

    const command = client.commands.get(commandName);

    //	if no such command in map just return
    if (!command)
        return logError(
            message,
            new Error("Undefined command"),
            logsForUsers.undefinedCommand
        );

    //	checking for any requirements in commands
    const badCommandRequirements = checkCommandRequirements(
        command,
        args,
        message
    );

    if (badCommandRequirements) {
        return message.channel.send(badCommandRequirements);
    }

    //	cooldowns
    const secondsLeft = checkCooldownTime(cooldowns, command, message);
    if (secondsLeft)
        return message.channel.send(onCooldown(secondsLeft, command.name));

    // finaly run command
    try {
        command.run(message, args);
    } catch (error) {
        logError(message, error);
    }
});

client.login(token);
