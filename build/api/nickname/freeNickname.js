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
exports.freeNickname = void 0;
const queries_1 = require("../../db/queries");
const kies_1 = require("../../redis/kies");
const redis_1 = require("../../redis/redis");
const freeNickname = (nickname, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const nicks = yield (0, queries_1.getNicknames)();
    if (!nicks)
        return null;
    const exist = nicks.some((nick) => nick === nickname);
    if (!exist)
        return null;
    const bindedNicknames = yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.bindNickname}${kies_1.keyDivider}${guildID}*`);
    if (!bindedNicknames)
        return true;
    const redisNicknames = yield Promise.all(bindedNicknames.map((key) => __awaiter(void 0, void 0, void 0, function* () { return (yield redis_1.redis.get(key)); })));
    const index = redisNicknames.findIndex((user) => {
        return user.nickname === nickname;
    });
    if (index !== -1)
        return kies_1.redisKey.destruct(bindedNicknames[index])[1];
    return true;
});
exports.freeNickname = freeNickname;
