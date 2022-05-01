"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeOutKeys = exports.ghostCommandsMarks = exports.ghostGuildBotId = exports.selectMenuId = exports.buttonId = exports.commandLogsMaxCount = exports.optionLobbyFieldToTitle = exports.defaultUserData = exports.numberToEmoji = exports.botStatusVariables = exports.stats = exports.ownerID = exports.guildIDs = exports.ghostApiTimeout = exports.msgEditTimeout = exports.msgDeleteTimeout = exports.ghostCmd = exports.palette = exports.withLogs = exports.production = void 0;
const discord_js_1 = require("discord.js");
exports.production = process.env.NODE_ENV === "production";
exports.withLogs = process.env.LOGS === "true";
exports.palette = {
    green: "#23911e",
    red: "#bb1616",
    blue: "#245abb",
    yellow: "#c5c510",
    black: "#000001",
};
exports.ghostCmd = {
    pendingTimeout: 3000,
    requestInterval: 500,
    deleteMessageTimeout: 4000,
};
exports.msgDeleteTimeout = {
    short: 4000,
    default: 6000,
    long: 10000,
    info: 120000,
};
exports.msgEditTimeout = {
    short: 2000,
};
exports.ghostApiTimeout = 5000;
exports.guildIDs = {
    ghostGuild: "408947483763277825",
    debugGuild: "556150178147467265",
};
exports.ownerID = "245209137103896586";
exports.stats = {
    gamesToBeRanked: 1,
};
exports.botStatusVariables = {
    lobbyCount: 0,
    gameCount: 0,
    ghost: false,
};
const numberToEmoji = (number) => {
    switch (number) {
        case 0:
            return "0️⃣";
        case 1:
            return "1️⃣";
        case 2:
            return "2️⃣";
        case 3:
            return "3️⃣";
        case 4:
            return "4️⃣";
        case 5:
            return "5️⃣";
        case 6:
            return "6️⃣";
        case 7:
            return "7️⃣";
        case 8:
            return "8️⃣";
        case 9:
            return "9️⃣";
        case 10:
            return "🔟";
        default:
            return `${number}`;
    }
};
exports.numberToEmoji = numberToEmoji;
exports.defaultUserData = { ping_on_start: false };
exports.optionLobbyFieldToTitle = {
    ["server" /* server */]: "server",
    ["winrate" /* winrate */]: "W | T | S",
};
exports.commandLogsMaxCount = 50;
exports.buttonId = {
    hostGame: "lobby-watcher_button_host-game",
    unhostGame: "lobby-watcher_button_unhost-game",
    showConfigSelector: "lobby-watcher_button_show-config-selector",
    startGame: "lobby-watcher_button_start-game",
    refreshWatcher: "lobby-watcher_button_refresh-watcher",
};
exports.selectMenuId = {
    selectMapConfig: "ghost_select_load-map-config",
    selectMapConfigWatcherHub: "lobby-watcher_select_load-map-config",
};
exports.ghostGuildBotId = parseInt(process.env.BOT_ID) || 2;
exports.ghostCommandsMarks = {
    load: {
        success: /loading MPQ file/i,
        error: /warning - unable to load MPQ file/i,
    },
    map: {
        success: /loading MPQ file/i,
        error: /warning - unable to load MPQ file/i,
    },
    pub: { success: /creating game/i, error: null },
    unhost: { success: /deleting current game/i, error: null },
    start: { success: /started loading/g, error: null },
};
exports.timeOutKeys = new discord_js_1.Collection();
