"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentLobby = exports.getCurrentLobbies = exports.getFullLobbyInfo = exports.playersLobbyToString = exports.getPlayersTableFromRawString = exports.parseMapName = exports.SPACE = exports.USER_LOBBY_PREFIX = exports.EMPTY_LOBBY_WINRATE = exports.EMPTY_LOBBY_DEFAULT = exports.EMPTY_LOBBY_USER_NAME = void 0;
const queries_1 = require("../db/queries");
const globals_1 = require("./globals");
const mapConfig_1 = require("./mapConfig");
exports.EMPTY_LOBBY_USER_NAME = "open";
exports.EMPTY_LOBBY_DEFAULT = "-";
exports.EMPTY_LOBBY_WINRATE = "unranked";
exports.USER_LOBBY_PREFIX = "> ";
exports.SPACE = "‎‏‏‎ ";
const parseMapName = (mapName) => mapName.match(/[^\\]+$/)[0].slice(0, -4);
exports.parseMapName = parseMapName;
const getPlayersTableFromRawString = (rawString, totalSlots, slotMap, rankMap, mapName) => __awaiter(void 0, void 0, void 0, function* () {
    //  Clean up from tabs and fill with empty symbols
    const rawPlayersString = rawString.split("\t").map((player) => {
        if (player === "")
            return exports.EMPTY_LOBBY_DEFAULT;
        return player;
    });
    //  Get values from massive or fill with epmty symbols to full lobby
    const playersArray = yield Promise.all([...Array(totalSlots).keys()].map(() => __awaiter(void 0, void 0, void 0, function* () {
        const name = rawPlayersString.shift();
        const server = rawPlayersString.shift();
        const ping = rawPlayersString.shift();
        const winrate = rankMap && name
            ? yield (0, queries_1.getPlayerWinrateForLobbyWatcher)(name)
            : exports.EMPTY_LOBBY_DEFAULT;
        return {
            name: `${exports.USER_LOBBY_PREFIX}${name || exports.EMPTY_LOBBY_DEFAULT}`,
            server: server || exports.EMPTY_LOBBY_DEFAULT,
            ping: ping || exports.EMPTY_LOBBY_DEFAULT,
            winrate: winrate || exports.EMPTY_LOBBY_DEFAULT,
        };
    })));
    //  If no usernames => lobby empty, just return null
    if (!playersArray.some((player) => player.name !== exports.EMPTY_LOBBY_DEFAULT))
        return null;
    //  Inserting teams titles in lobby table
    let slotsSumm = 0;
    slotMap.reverse().forEach(({ slots, name: title }) => {
        slotsSumm = slotsSumm + slots;
        if (slotsSumm > totalSlots)
            return;
        playersArray.splice(totalSlots - slotsSumm, 0, {
            name: `\`${title[0].toUpperCase() + title.substr(1)}\``,
            server: exports.SPACE,
            ping: exports.SPACE,
            winrate: exports.SPACE,
        });
    });
    const lobby = playersArray.map((player) => {
        //  If title, just return w/o editing
        if (player.ping === exports.SPACE) {
            return player;
        }
        //  Change ping
        const ping = player.ping === exports.EMPTY_LOBBY_DEFAULT
            ? exports.EMPTY_LOBBY_DEFAULT
            : player.ping + "ms";
        //  Change username
        const name = player.name === exports.EMPTY_LOBBY_DEFAULT ? exports.EMPTY_LOBBY_USER_NAME : player.name;
        const winrate = player.winrate === exports.EMPTY_LOBBY_DEFAULT
            ? exports.EMPTY_LOBBY_DEFAULT
            : `${player.winrate}`;
        return Object.assign(Object.assign({}, player), { ping, name, winrate });
    });
    return lobby;
});
exports.getPlayersTableFromRawString = getPlayersTableFromRawString;
const playersLobbyToString = (lobbyTable, optionField) => {
    //  Make strings for embed
    const lobbyFields = lobbyTable.reduce((obj, player) => {
        return {
            nicks: obj.nicks + player.name + "\n",
            pings: obj.pings + player.ping + "\n",
            option: {
                fieldName: globals_1.optionLobbyFieldToTitle[optionField],
                string: obj.option.string + player[optionField] + "\n",
            },
        };
    }, {
        nicks: "",
        pings: "",
        option: {
            fieldName: "",
            string: "",
        },
    });
    return lobbyFields;
};
exports.playersLobbyToString = playersLobbyToString;
const getFullLobbyInfo = (guildID, game) => __awaiter(void 0, void 0, void 0, function* () {
    if (game.gamename === "" &&
        game.ownername === "" &&
        game.creatorname === "") {
        return null;
    }
    const mapName = (0, exports.parseMapName)(game.map);
    const defaultConfig = {
        name: mapName,
        guildID: guildID,
        options: {
            ranking: false,
            spectatorLivesMatter: false,
        },
        slots: game.slotstotal,
        slotMap: [{ slots: game.slotstotal, name: "Lobby" }],
    };
    const config = (yield (0, mapConfig_1.searchMapConfigByMapName)(mapName, guildID)) || defaultConfig;
    const lobbyTable = yield (0, exports.getPlayersTableFromRawString)(game.usernames, config.slots, config.slotMap, config.options.ranking, config.name);
    return {
        botid: game.botid,
        gamename: game.gamename,
        owner: game.ownername,
        host: game.creatorname,
        mapname: mapName,
        players: lobbyTable,
        slots: config.slots,
        slotsTaken: game.slotstotal - config.slots < 0
            ? 0
            : game.slotstaken - (game.slotstotal - config.slots),
        mapImage: config.options.mapImage,
    };
});
exports.getFullLobbyInfo = getFullLobbyInfo;
const getCurrentLobbies = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const rawGames = yield (0, queries_1.getLobbyList)();
    if (!rawGames)
        return null;
    const lobbies = (yield Promise.all(rawGames.map((game) => __awaiter(void 0, void 0, void 0, function* () { return (0, exports.getFullLobbyInfo)(guildID, game); })))).filter((lobby) => lobby !== null);
    return lobbies;
});
exports.getCurrentLobbies = getCurrentLobbies;
const getCurrentLobby = (guildID, botid) => __awaiter(void 0, void 0, void 0, function* () {
    const rawGames = yield (0, queries_1.getLobbyList)(botid);
    if (!rawGames)
        return undefined;
    const rawGame = rawGames.find((game) => game.botid === botid);
    if (!rawGame)
        return null;
    const lobby = yield (0, exports.getFullLobbyInfo)(guildID, rawGame);
    return lobby;
});
exports.getCurrentLobby = getCurrentLobby;
