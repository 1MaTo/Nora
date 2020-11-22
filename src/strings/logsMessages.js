import { defaultCooldown } from "../../config.json";

export const badArguments = (prefix, name, usage) => `Bad arguments for this command\nExample: \`${prefix}${name} ${usage}\``;

export const commandNotFound = "Command not found";

export const undefinedError = "Something went wrong :(";

export const runningCommandError = "Command failed while running";

export const onlyForGuildCommand = "This command can be used only in channels";

export const onlyForDmCommand = "This command can be used only in dm's"

export const onCooldown = (timeLeft, name) => `Wait **${timeLeft.toFixed(1)}** second(s) to use \`${name}\` again`;

export const needAdminPermission = "You need to be ADMIN for using this command";

export const needDeleteMsgPermission = "Looks like I need permissions to delete messsages"

export const commandInDevelopment = "This command is in development now"

export const lobbyWatcherCommand = {
    lobbiesCount: (count) => `Currently \`${count}\` lobbies right now`,
    alreadyWatchingInThisGuild: "I'm already watching for games in this server",
    stopedWathing: "Watching for games stoped",
    startWatching: (channel, delay) => `Start watching for games in <#${channel}>. Updates every ${delay/1000}s`,
    nothingToStop: "Nothing to stop on this server"
}

export const helpCommand = {
    commandList: "__List of commands__\n",

    tipForSingleCommand: (prefix) => `\nYou can send \`${prefix}help [command name]\` to get info about specific command!`,

    cantSentDm: "Can't DM you, do you have DMs disabled?",

    commandShort: (prefix, name, usage, description) => `\`${prefix}${name} ${usage}\` ----> ${description}`,

    singleCommandInfo: (
        prefix,
        { name, description, usage, cooldown = null }
    ) =>
        `**${name}**\nDescription: ${description}\n__Usage:__\n\`${prefix}${name} ${usage}\`\nCooldown: ${cooldown || defaultCooldown } second(s)`,
};

export const dbErrors = {
    queryError: "Error in db query",
    noGamesInLobby: "There are no games right now",
};

export const lobbyCommand = {
    alreadyLooking: "I'm already looking for games",
    noGamesInLobby: "No games in lobby",
};

export const reloadCommand = {
    commandReloaded: (name) => `Command \`${name}\` was reloaded`,
};
