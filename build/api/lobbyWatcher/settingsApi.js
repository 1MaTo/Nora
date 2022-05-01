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
exports.deleteLobbyWatcherSettings = exports.getLobbyWatcherSettings = exports.updateLobbyWatcherSettings = void 0;
const kies_1 = require("../../redis/kies");
const redis_1 = require("../../redis/redis");
const updateLobbyWatcherSettings = (guildID, data) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
    const settings = (yield redis_1.redis.get(key));
    const result = yield redis_1.redis.set(key, Object.assign(Object.assign({}, settings), data));
    if (!result)
        return null;
    return result;
});
exports.updateLobbyWatcherSettings = updateLobbyWatcherSettings;
const getLobbyWatcherSettings = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
    const settings = (yield redis_1.redis.get(key));
    return settings;
});
exports.getLobbyWatcherSettings = getLobbyWatcherSettings;
const deleteLobbyWatcherSettings = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
    const result = yield redis_1.redis.del(key);
    if (!result)
        return null;
    return result;
});
exports.deleteLobbyWatcherSettings = deleteLobbyWatcherSettings;
