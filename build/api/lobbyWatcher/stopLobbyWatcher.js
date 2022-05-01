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
exports.stopLobbyWatcher = void 0;
const kies_1 = require("../../redis/kies");
const redis_1 = require("../../redis/redis");
const discordChannel_1 = require("../../utils/discordChannel");
const log_1 = require("../../utils/log");
const stopLobbyWatcher = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
    const settings = (yield redis_1.redis.get(key));
    yield redis_1.redis.set(key, Object.assign(Object.assign({}, settings), { paused: true }));
    if (settings) {
        const channel = yield (0, discordChannel_1.getTextChannel)(settings.channelID);
        const lobbyGamesMsgIdList = yield getLobbyGameMsgIdList(settings.guildID, settings.channelID);
        try {
            yield channel.bulkDelete([settings.headerID, ...lobbyGamesMsgIdList]);
        }
        catch (err) {
            (0, log_1.log)("[stop watcher] cant delete messages", err);
        }
    }
    const lobbyGamesKeys = (yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.lobbyGameWatcher}${kies_1.keyDivider}${guildID}${kies_1.keyDivider}${settings.channelID}${kies_1.keyDivider}*`)) || [];
    yield redis_1.redis.del([key, ...lobbyGamesKeys]);
    return;
});
exports.stopLobbyWatcher = stopLobbyWatcher;
const getLobbyGameMsgIdList = (guildID, channelID) => __awaiter(void 0, void 0, void 0, function* () {
    const lobbyGamesKeys = yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.lobbyGameWatcher}${kies_1.keyDivider}${guildID}${kies_1.keyDivider}${channelID}${kies_1.keyDivider}*`);
    if (!lobbyGamesKeys)
        return [];
    return yield Promise.all(lobbyGamesKeys.map((key) => __awaiter(void 0, void 0, void 0, function* () {
        const item = (yield redis_1.redis.get(key));
        if (!item)
            return null;
        return item.msgId;
    })));
});
