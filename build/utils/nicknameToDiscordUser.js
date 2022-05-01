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
exports.getDiscordUsersFromNicknames = void 0;
const bot_1 = require("../bot");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const log_1 = require("./log");
const getDiscordUsersFromNicknames = (nicknames, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const users = (yield Promise.all((yield redis_1.redis.scanForPattern(`${kies_1.groupsKey.bindNickname}${kies_1.keyDivider}${guildID}*`)).map((key) => __awaiter(void 0, void 0, void 0, function* () {
        return (yield redis_1.redis.get(key));
    })))).filter((user) => nicknames.includes(user.nickname));
    return (yield Promise.all(users.map((userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield bot_1.client.users.fetch(userData.discordID, {
                cache: false,
            });
            return Object.assign(Object.assign({}, userData), { user });
        }
        catch (error) {
            (0, log_1.log)(error);
            return null;
        }
    })))).filter((data) => data !== null);
});
exports.getDiscordUsersFromNicknames = getDiscordUsersFromNicknames;
