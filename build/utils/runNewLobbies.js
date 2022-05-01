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
exports.runNewLobbies = void 0;
const lobbyMsgUpdater_1 = require("../api/lobbyWatcher/lobbyMsgUpdater");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const log_1 = require("./log");
const runNewLobbies = ({ guildID, channelID, delay }, lobbyList) => __awaiter(void 0, void 0, void 0, function* () {
    const runUpdaters = lobbyList.map((lobby) => __awaiter(void 0, void 0, void 0, function* () {
        const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyGameWatcher, [
            guildID,
            channelID,
            lobby.botid.toString(),
        ]);
        const lobbyGameWatcher = yield redis_1.redis.get(key);
        if (lobbyGameWatcher) {
            //log(`[run new lobbies] game already watched [${lobby.botid}]`);
            return;
        }
        (0, log_1.log)(`[run new lobbies] running new lobby game updater [${lobby.botid}]`);
        yield redis_1.redis.set(key, {
            botid: lobby.botid,
            delay,
            msgId: "",
        });
        (0, lobbyMsgUpdater_1.lobbyMsgUpdater)(guildID, lobby.botid, delay);
    }));
    return Promise.all(runUpdaters);
});
exports.runNewLobbies = runNewLobbies;
