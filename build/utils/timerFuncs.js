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
exports.gamesStatusUpdater = exports.lobbyStatusUpdater = exports.ghostStatusUpdater = exports.gamestatsUpdater = exports.lobbyWatcherUpdater = void 0;
const queries_1 = require("../db/queries");
const lobby_1 = require("../embeds/lobby");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const discordMessage_1 = require("./discordMessage");
const events_1 = require("./events");
const gamestatsUtils_1 = require("./gamestatsUtils");
const globals_1 = require("./globals");
const lobbyParser_1 = require("./lobbyParser");
const log_1 = require("./log");
const mapConfig_1 = require("./mapConfig");
const reportToOwner_1 = require("./reportToOwner");
const requestToGuiServer_1 = require("./requestToGuiServer");
const timePassed_1 = require("./timePassed");
const lobbyWatcherUpdater = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
        const settings = (yield redis_1.redis.get(key));
        // EXIT FROM LOOP, LOBBY WATCHER STOPED
        if (!settings) {
            return;
        }
        const headerMsg = yield discordMessage_1.getMessageById(settings.headerID, settings.channelID);
        // GET FULL INFO FOR LOBBY
        const games = yield lobbyParser_1.getCurrentLobbies(guildID);
        // IF FAILED TO GET LOBBIES JUST SKIP AND WAIT NEXT TIME
        if (!games) {
            yield reportToOwner_1.report(`FAILED TO GET LOBBY GAMES, WAIT FOR NEXT TRY AFTER 10 SECONDS`);
            setTimeout(() => exports.lobbyWatcherUpdater(settings.guildID), 10000);
            return;
        }
        // UPDATING HEADER MESSAGE
        try {
            yield headerMsg.edit({
                embed: lobby_1.header(games.length, timePassed_1.getPassedTime(settings.startTime, Date.now())),
            });
        }
        catch (error) {
            // IF FAILED TO UPDATE  HEADER MESSAGE CRATE NEW ONE
            log_1.log(error);
            const newHeaderMsg = yield discordMessage_1.sendResponse(settings.channelID, {
                embed: lobby_1.header(games.length, timePassed_1.getPassedTime(settings.startTime, Date.now())),
            });
            settings.headerID = newHeaderMsg.id;
        }
        // DELETE OUTDATED LOBBY MESSAGES
        if (settings.lobbysID) {
            const newLobbysID = [];
            yield Promise.all(settings.lobbysID.map((lobbyMsg) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (!games.some((game) => game.botid === lobbyMsg.botID)) {
                        const msg = yield discordMessage_1.getMessageById(lobbyMsg.messageID, settings.channelID);
                        msg && (yield msg.delete());
                    }
                    else {
                        newLobbysID.push(lobbyMsg);
                    }
                }
                catch (error) {
                    log_1.log(error);
                }
            })));
            settings.lobbysID = newLobbysID;
        }
        // UPDATING CURRENT LOBBY MESSAGES
        yield Promise.all(games.map((game) => __awaiter(void 0, void 0, void 0, function* () {
            const config = yield mapConfig_1.searchMapConfigByMapName(game.mapname, guildID);
            const optionField = config && config.options.ranking
                ? "winrate" /* winrate */
                : "server" /* server */;
            const parsedPlayers = lobbyParser_1.playersLobbyToString(game.players, optionField);
            const parsedGame = Object.assign(Object.assign({}, game), { players: parsedPlayers });
            const existMsg = settings.lobbysID.find((msg) => msg.botID === game.botid);
            if (existMsg) {
                const msg = yield discordMessage_1.getMessageById(existMsg.messageID, settings.channelID);
                // IF LOBBY PENDING 5+ HOURS, DELETE THIS LOBBY FROM DB
                if (Date.now() - existMsg.startTime > 1000 * 60 * 60 * 5) {
                    queries_1.clearLobbyGame(game.botid);
                }
                try {
                    yield msg.edit({
                        embed: lobby_1.lobbyGame(parsedGame, timePassed_1.getPassedTime(existMsg.startTime, Date.now())),
                    });
                }
                catch (error) {
                    log_1.log(error);
                    // IF FAILED TO UPDATE MESSAGE BUT ITS EXIST SKIP TO NEXT TIME
                    if (msg)
                        return;
                    // ELSE CREATE NEW ONE
                    const newMsg = yield discordMessage_1.sendResponse(settings.channelID, {
                        embed: lobby_1.lobbyGame(parsedGame, timePassed_1.getPassedTime(existMsg.startTime, Date.now())),
                    });
                    const msgIndex = settings.lobbysID.findIndex((lobbyMsg) => lobbyMsg.botID === existMsg.botID);
                    if (newMsg) {
                        settings.lobbysID[msgIndex].messageID = newMsg.id;
                    }
                    else {
                        settings.lobbysID.splice(msgIndex, 1);
                    }
                }
            }
            else {
                const startTime = Date.now();
                const newLobbyMsg = yield discordMessage_1.sendResponse(settings.channelID, {
                    embed: lobby_1.lobbyGame(parsedGame, timePassed_1.getPassedTime(startTime, Date.now())),
                });
                if (newLobbyMsg) {
                    settings.lobbysID.push({
                        botID: game.botid,
                        messageID: newLobbyMsg.id,
                        startTime: Date.now(),
                    });
                }
            }
        })));
        yield redis_1.redis.set(key, settings);
        setTimeout(() => exports.lobbyWatcherUpdater(settings.guildID), settings.delay);
    }
    catch (err) {
        const error = err;
        yield reportToOwner_1.report(`${error.name}\n\n${error.message}\n\n${error.stack} FROM LOBBY WATCHER CRASHED`);
        log_1.log(error);
        setTimeout(() => exports.lobbyWatcherUpdater(guildID), 10000);
        //await changeBotStatus("🔄 Crashed 😱, reboot 🔄");
        //reloadBot(false);
    }
});
exports.lobbyWatcherUpdater = lobbyWatcherUpdater;
const gamestatsUpdater = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.gameStats, [guildID]);
    const settings = (yield redis_1.redis.get(key));
    if (!settings)
        return;
    const ids = yield queries_1.getFinishedGamesId();
    if (!ids)
        return setTimeout(() => exports.gamestatsUpdater(settings.guildID), settings.delay);
    if (!settings.prevGamesCount) {
        settings.prevGamesCount = ids.length;
        yield redis_1.redis.set(key, settings);
    }
    if (ids.length - settings.prevGamesCount < 0) {
        settings.prevGamesCount = ids.length;
        yield redis_1.redis.set(key, settings);
    }
    const newGamesCount = ids.length - settings.prevGamesCount;
    if (newGamesCount > 0) {
        settings.prevGamesCount = ids.length;
        yield redis_1.redis.set(key, settings);
        const idToPoll = ids.splice(-newGamesCount);
        gamestatsUtils_1.collectGamesData(idToPoll, settings.channelID, settings.guildID);
    }
    setTimeout(() => exports.gamestatsUpdater(settings.guildID), settings.delay);
});
exports.gamestatsUpdater = gamestatsUpdater;
const ghostStatusUpdater = () => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield requestToGuiServer_1.getChatRows();
    const changedState = globals_1.botStatusVariables.ghost !== Boolean(rows);
    if (changedState) {
        globals_1.botStatusVariables.ghost = Boolean(rows);
        events_1.botStatusInfo.emit("update" /* update */);
    }
    setTimeout(() => exports.ghostStatusUpdater(), 5000);
});
exports.ghostStatusUpdater = ghostStatusUpdater;
const lobbyStatusUpdater = () => __awaiter(void 0, void 0, void 0, function* () {
    const games = (yield queries_1.getLobbyList()).filter((game) => !(game.gamename === "" &&
        game.ownername === "" &&
        game.creatorname === ""));
    const changedState = globals_1.botStatusVariables.lobbyCount !== games.length;
    if (changedState) {
        globals_1.botStatusVariables.lobbyCount = games.length;
        events_1.botStatusInfo.emit("update" /* update */);
    }
    setTimeout(() => exports.lobbyStatusUpdater(), 5000);
});
exports.lobbyStatusUpdater = lobbyStatusUpdater;
const gamesStatusUpdater = (delay) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield requestToGuiServer_1.getChatRows();
    const sent = yield requestToGuiServer_1.sendCommand("ggs");
    if (!sent)
        return setTimeout(() => exports.gamesStatusUpdater(delay), delay);
    const result = yield requestToGuiServer_1.checkLogsForKeyWords(/\(\d+ today+\).*/g, rows, 500, 5000);
    if (!result)
        return setTimeout(() => exports.gamesStatusUpdater(delay), delay);
    const gameCount = result.match(/\#\d+:/g);
    if (!gameCount) {
        globals_1.botStatusVariables.gameCount = 0;
        events_1.botStatusInfo.emit("update" /* update */);
        return setTimeout(() => exports.gamesStatusUpdater(delay), delay);
    }
    const changedState = globals_1.botStatusVariables.gameCount !== gameCount.length;
    if (changedState) {
        globals_1.botStatusVariables.gameCount = gameCount.length;
        events_1.botStatusInfo.emit("update" /* update */);
    }
    setTimeout(() => exports.gamesStatusUpdater(delay), delay);
});
exports.gamesStatusUpdater = gamesStatusUpdater;
