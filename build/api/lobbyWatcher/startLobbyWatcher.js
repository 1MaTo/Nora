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
exports.startLobbyWatcher = void 0;
const kies_1 = require("../../redis/kies");
const redis_1 = require("../../redis/redis");
const log_1 = require("../../utils/log");
const headerMsgUpdater_1 = require("./headerMsgUpdater");
const startLobbyWatcher = (guildID, channelID, delay, botid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
        const result = yield redis_1.redis.set(key, {
            channelID: channelID,
            guildID: guildID,
            delay: delay,
            headerID: "",
            activeLobbyCount: 0,
            botid: botid,
            paused: false,
            lobbysID: [],
        });
        if (result === undefined) {
            (0, log_1.log)("[start lobby watcher] cant set redis data");
            return false;
        }
        (0, headerMsgUpdater_1.headerMsgUpdater)(guildID, delay);
        return true;
    }
    catch (error) {
        (0, log_1.log)(error);
        return false;
    }
});
exports.startLobbyWatcher = startLobbyWatcher;
