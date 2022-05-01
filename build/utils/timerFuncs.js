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
exports.gamesStatusUpdater = exports.lobbyStatusUpdater = exports.ghostStatusUpdater = exports.gamestatsUpdater = void 0;
const queries_1 = require("../db/queries");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const events_1 = require("./events");
const gamestatsUtils_1 = require("./gamestatsUtils");
const globals_1 = require("./globals");
const requestToGuiServer_1 = require("./requestToGuiServer");
const gamestatsUpdater = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.gameStats, [guildID]);
    const settings = (yield redis_1.redis.get(key));
    if (!settings)
        return;
    const ids = yield (0, queries_1.getFinishedGamesId)();
    if (!ids)
        return setTimeout(() => (0, exports.gamestatsUpdater)(settings.guildID), settings.delay);
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
        (0, gamestatsUtils_1.collectGamesData)(idToPoll, settings.channelID, settings.guildID);
    }
    setTimeout(() => (0, exports.gamestatsUpdater)(settings.guildID), settings.delay);
});
exports.gamestatsUpdater = gamestatsUpdater;
const ghostStatusUpdater = () => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield (0, requestToGuiServer_1.getChatRows)();
    const changedState = globals_1.botStatusVariables.ghost !== Boolean(rows);
    if (changedState) {
        globals_1.botStatusVariables.ghost = Boolean(rows);
        events_1.botEvents.emit("update" /* update */);
    }
    setTimeout(() => (0, exports.ghostStatusUpdater)(), 5000);
});
exports.ghostStatusUpdater = ghostStatusUpdater;
const lobbyStatusUpdater = () => __awaiter(void 0, void 0, void 0, function* () {
    const games = (yield (0, queries_1.getLobbyList)()).filter((game) => !(game.gamename === "" &&
        game.ownername === "" &&
        game.creatorname === ""));
    const changedState = globals_1.botStatusVariables.lobbyCount !== games.length;
    if (changedState) {
        globals_1.botStatusVariables.lobbyCount = games.length;
        events_1.botEvents.emit("update" /* update */);
    }
    setTimeout(() => (0, exports.lobbyStatusUpdater)(), 5000);
});
exports.lobbyStatusUpdater = lobbyStatusUpdater;
const gamesStatusUpdater = (delay) => __awaiter(void 0, void 0, void 0, function* () {
    const gameCount = yield (0, requestToGuiServer_1.getCurrentGamesCount)();
    globals_1.botStatusVariables.gameCount = gameCount;
    if (gameCount !== globals_1.botStatusVariables.gameCount)
        events_1.botEvents.emit("update" /* update */);
    setTimeout(() => (0, exports.gamesStatusUpdater)(delay), delay);
});
exports.gamesStatusUpdater = gamesStatusUpdater;
