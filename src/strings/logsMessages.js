import { description } from "../commands/test";
import { defaultCooldown } from "../config.json";

export const badArguments = (prefix, name, usage) =>
    `Bad arguments for this command\nExample: \`${prefix}${name} ${usage}\``;

export const commandNotFound = "Command not found";

export const undefinedError = "Something went wrong :(";

export const runningCommandError = "Command failed while running";

export const onlyForGuildCommand = "This command can be used only in channels";

export const onCooldown = (timeLeft, name) =>
    `Wait **${timeLeft.toFixed(1)}** second(s) to use \`${name}\` again`;

export const needAdminPermission =
    "You need to be ADMIN for using this command";

export const helpCommand = {
    commandList: "__List of commands__\n",

    tipForSingleCommand: (prefix) =>
        `\nYou can send \`${prefix}help [command name]\` to get info about specific command!`,

    cantSentDm: "Can't DM you, do you have DMs disabled?",

    commandShort: (prefix, name, usage, description) =>
        `\`${prefix}${name} ${usage}\` ----> ${description}`,

    singleCommandInfo: (
        prefix,
        { name, description, usage, cooldown = null }
    ) =>
        `**${name}**\nDescription: ${description}\nUsage: \`${prefix}${name} ${usage}\`\nCooldown: ${
            cooldown || defaultCooldown
        } second(s)`,
};

export const dbErrors = {
    queryError: "Error in db query",
    noGamesInLobby: "There are no games right now",
};

export const lobbyCommand = {
    alreadyLooking: "I'm already looking for games",
};

export const reloadCommand = {
    commandReloaded: (name) => `Command \`${name}\` was reloaded`,
};
