"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionLobbyFieldToTitle = exports.defaultUserData = exports.numberToEmoji = exports.botStatusVariables = exports.stats = exports.ownerID = exports.guildIDs = exports.msgDeleteTimeout = exports.ghostCmd = exports.palette = exports.production = void 0;
exports.production = process.env.NODE_ENV === "production";
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
    short: 3000,
    default: 5000,
    long: 10000,
    info: 120000,
};
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
