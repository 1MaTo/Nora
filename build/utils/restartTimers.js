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
const headerMsgUpdater_1 = require("../api/lobbyWatcher/headerMsgUpdater");
const lobbyMsgUpdater_1 = require("../api/lobbyWatcher/lobbyMsgUpdater");
const settingsApi_1 = require("../api/lobbyWatcher/settingsApi");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const globals_1 = require("./globals");
const log_1 = require("./log");
const timerFuncs_1 = require("./timerFuncs");
const restartLobbyWatcher = () => __awaiter(void 0, void 0, void 0, function* () {
    const lobbyWatcherKeys = yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.lobbyWatcher}${kies_1.keyDivider}*`);
    lobbyWatcherKeys &&
        (yield Promise.all(lobbyWatcherKeys.map((key) => __awaiter(void 0, void 0, void 0, function* () {
            const keys = kies_1.redisKey.destruct(key);
            const settings = yield (0, settingsApi_1.getLobbyWatcherSettings)(keys[0]);
            if (!settings)
                return;
            if (globals_1.production && keys[0] === globals_1.guildIDs.debugGuild)
                return;
            if (!globals_1.production && keys[0] !== globals_1.guildIDs.debugGuild)
                return;
            (0, log_1.log)("[restart lobby watcher] starting lobby watcher");
            (0, headerMsgUpdater_1.headerMsgUpdater)(keys[0], settings.delay);
            const lobbyGameKeys = yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.lobbyGameWatcher}${kies_1.keyDivider}${keys[0]}${kies_1.keyDivider}*`);
            if (!lobbyGameKeys)
                return;
            lobbyGameKeys.forEach((key) => {
                const [guildId, channelId, botid] = kies_1.redisKey.destruct(key);
                if (guildId && botid) {
                    (0, log_1.log)("[restart lobby watcher] starting game watcher");
                    (0, lobbyMsgUpdater_1.lobbyMsgUpdater)(guildId, parseInt(botid), settings.delay);
                }
            });
        }))));
    return lobbyWatcherKeys ? lobbyWatcherKeys.length : 0;
});
exports.restartLobbyWatcher = restartLobbyWatcher;
const restartGamestats = () => __awaiter(void 0, void 0, void 0, function* () {
    const gamestatsKeys = yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.gameStats}${kies_1.keyDivider}*`);
    gamestatsKeys &&
        gamestatsKeys.map((key) => {
            const guildID = kies_1.redisKey.destruct(key);
            (0, timerFuncs_1.gamestatsUpdater)(guildID[0]);
        });
    return gamestatsKeys ? gamestatsKeys.length : 0;
});
exports.restartGamestats = restartGamestats;
