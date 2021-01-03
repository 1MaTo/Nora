import { defaultCooldown } from "../../config.json";

export const badArguments = (prefix, name, usage) =>
    `Bad arguments for this command\nExample: \`${prefix}${name} ${usage}\``;

export const commandNotFound = "Command not found";

export const undefinedError = "Something went wrong :(";

export const runningCommandError = "Command failed while running";

export const onlyForGuildCommand = "This command can be used only in channels";

export const onlyForDmCommand = "This command can be used only in dm's";

export const onCooldown = (timeLeft, name) => `Wait **${timeLeft.toFixed(1)}** second(s) to use \`${name}\` again`;

export const needAdminPermission = "You need to be ADMIN for using this command";

export const needDeleteMsgPermission = "Looks like I need permissions to delete messsages";

export const commandInDevelopment = "This command is in development now";

export const lobbyWatcherCommand = {
    lobbiesCount: count => `Currently \`${count}\` lobbies right now`,
    alreadyWatchingInThisGuild: "I'm already watching for games in this server",
    stopedWathing: "Watching for games stoped",
    startWatching: (channel, delay) => `Start watching for games in <#${channel}>. Updates every ${delay / 1000}s`,
    nothingToStop: "Nothing to stop on this server",
};

export const helpCommand = {
    commandList: "**__List of commands__**\n",

    tipForSingleCommand: prefix =>
        `You can send \`${prefix}help [command name]\` to get info about specific command!\n<> - required\n[] - optional`,

    cantSentDm: "Can't DM you, do you have DMs disabled?",

    commandShort: (prefix, name, usage, description, aliases) =>
        `\`${prefix}${name}\` ${usage}\n*aliases:* ${
            aliases && aliases.map(a => `\`${prefix}${a}\``).toString()
        }\n\`\`\`${description}\`\`\`\n`,

    singleCommandInfo: (prefix, { name, description, usage, cooldown = null, aliases }) =>
        `\`${name}\`\n\`\`\`${description}\`\`\`\n\`${prefix}${name} ${usage}\`\naliases: ${
            aliases && aliases.map(a => `\`${prefix}${a}\``).toString()
        }\n*Cooldown: ${cooldown || defaultCooldown} second(s)*`,
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
    reboot: `Going to reboot...`,
    commandReloaded: name => `Command \`${name}\` was reloaded`,
    errorReboot: `Reboot failed...`,
};

export const needPlayerCommand = {
    onlyOneNotificationForGame: "This game already has notifications, only 1 notification for game",
    tipsForSub: gameid => `> \`!nj ${gameid}\` for subscribe to notifications\n> \`!nl ${gameid}\` for unsubscribe`,
    smthWrong: "Something did wrong in notifications, sorry",
    badPlayersCount: "Invalid players count",
    badDelay: "Bad delay",
    minDelay: delay => `Minimum delay is ${delay}`,
    notificationAlreadyRunning: "You already start notification",
    noSuchGameInLobby: "Game with this id not exist",
    startNotifications: `Notifications for game started`,
    stopNotifications: "Notifications for game stoped",
    nothingToStop: "Nothing to stop",
    recreateNotification: "Updating notification...",
    notification: (gameid, gamename, playerCount, role) => `\`[#${gameid}] ${gamename}\` **+${playerCount}**  ${role}`,
    gameSet: (gameid, gamename, role, users) => `\`[#${gameid}] ${gamename}\` **ready to start!** ${role} ${users}`,
    gameOverSet: (gameid, gamename, overPlayers, role, users) =>
        `\`[#${gameid}] ${gamename}\` is overcrowded by **${overPlayers}** people! ${role} ${users}`,
};

export const notificationJoinCommand = {
    undefinedGameId: "Game with this id doesn't exist",
    alreadySubscribed: "You already subscribed for this game",
    subscribed: "I'will ping you when game will be ready",
    unsubscribed: "You are unsubscribed from ping",
    nothingToUnsubscribe: "There are no games you were subscribed to",
};

export const mapConfigCommands = {
    noConfigForMap: "There is no config for this map",
    noMapConfigs: "There are no map configs for this server",
    badArgs: "Some of arguments invalid, try again",
    configUpdateFail: "Config update/create failed",
    configUpdateSuccess: "Config update/create success",
    configDeleteFail: "No config to delete",
    configDeleteSuccess: "Config delete success",
    validFieldValues: (key, values) => `Invalid field values for \`${key}\`\nValid values: \`${values.join(", ")}\``,
};

export const gameStatsCommands = {
    enabled: "Game stats collecting enabled",
    disabled: "Game stats collecting disabled",
    alreadyEnabled: "Game stats collecting is already enabled",
    gameEnded: duration =>
        `GG guys, now select *WINNER* team\nPlease __do not participate__ if you dont know game result\nThis message will be deleted in **${
            duration / 60000
        }** minutes`,
};

export const nicknameCommand = {
    noNicknames: `❌ There are no available nicknames in database`,
    badNickname: `❌ This nickname does not exist in database, you need to play at least 1 game to bind nickname`,
    badUser: `❌ No such user in this server`,
    nicknameBind: `✅ Nickname binded`,
    nicknameUnbind: `✅ Nickname unbinded`,
    alreadyBind: `❗ Nickname already binded`,
    alreadyUnbind: `❗ Nickname already unbinded`,
    noBindedNicknames: `❗ You dont have any binded nicknames`,
    rebindDone: (from, to) => `:arrows_counterclockwise: Force rebind done\n\`${from}\` :point_right: \`${to}\``,
    nicknameReserved: user =>
        `❌ This nickname already reserved by \`${user}\`, ask him to unbind nick or ask admin to rebind this nick for you`,
};

export const statsCommand = {
    badStatWord: `❌ Bad stats command`,
    badNicknames: `❌ No nickname(s) provided/binded to your account`,
    noGamesForThisNickname: nicknames => `❌ No games found for \`${nicknames.join("`, `")}\``,
};

export const botCommand = {
    wrongGuild: `❌ This command is only for one server and one ghost bot`,
    alreadyWatching: `❌ Already watching on this server`,
    noPermisions: `❌ Not admin can only use [map|pub|unhost|getgame|getgames|load]`,
    watchStarted: (channel, rows, delay) => `✅ Show logs in ${channel}, with every ${delay} ms, max row is ${rows}`,
};
