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
    commandList: "**__List of commands__**\n",

    tipForSingleCommand: (prefix) => `You can send \`${prefix}help [command name]\` to get info about specific command!\n<> - required\n[] - optional`,

    cantSentDm: "Can't DM you, do you have DMs disabled?",

    commandShort: (prefix, name, usage, description, aliases) => `\`${prefix}${name}\` ${usage}\n*aliases:* ${aliases && aliases.map(a => `\`${prefix}${a}\``).toString()}\n\`\`\`${description}\`\`\`\n`,

    singleCommandInfo: (
        prefix,
        { name, description, usage, cooldown = null, aliases }
    ) =>
        `\`${name}\`\n\`\`\`${description}\`\`\`\n\`${prefix}${name} ${usage}\`\naliases: ${aliases && aliases.map(a => `\`${prefix}${a}\``).toString()}\n*Cooldown: ${cooldown || defaultCooldown } second(s)*`,
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

export const needPlayerCommand = {
    badPlayersCount: "Invalid players count",
    badDelay: "Bad delay",
    minDelay: (delay) => `Minimum delay is ${delay}`,
    notificationAlreadyRunning: "You already start notification",
    noSuchGameInLobby: "Game with this id not exist",
    startNotifications: `Notifications for game started`,
    stopNotifications: "Notifications for game stoped",
    notification: (gamename, playerCount, role) => `\`${gamename}\` **+${playerCount}**  ${role}`,
    gameSet: (gamename, role) => `\`${gamename}\` ready to start! ${role}`,
    gameOverSet: (gamename, overPlayers, role) => `\`${gamename}\` is overcrowded by **${overPlayers}** people! ${role}`
}