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
exports.restartGamestats = exports.restartLobbyWatcher = void 0;
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const timerFuncs_1 = require("./timerFuncs");
const restartLobbyWatcher = () => __awaiter(void 0, void 0, void 0, function* () {
    const lobbyWatcherKeys = yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.lobbyWatcher}${kies_1.keyDivider}*`);
    lobbyWatcherKeys &&
        lobbyWatcherKeys.map((key) => {
            const guildID = kies_1.redisKey.destruct(key);
            timerFuncs_1.lobbyWatcherUpdater(guildID[0]);
        });
    return lobbyWatcherKeys ? lobbyWatcherKeys.length : 0;
});
exports.restartLobbyWatcher = restartLobbyWatcher;
const restartGamestats = () => __awaiter(void 0, void 0, void 0, function* () {
    const gamestatsKeys = yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.gameStats}${kies_1.keyDivider}*`);
    gamestatsKeys &&
        gamestatsKeys.map((key) => {
            const guildID = kies_1.redisKey.destruct(key);
            timerFuncs_1.gamestatsUpdater(guildID[0]);
        });
    return gamestatsKeys ? gamestatsKeys.length : 0;
});
exports.restartGamestats = restartGamestats;
