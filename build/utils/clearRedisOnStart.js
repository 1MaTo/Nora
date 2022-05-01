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
exports.clearRedisOnStart = void 0;
const bot_1 = require("../bot");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const clearRedisOnStart = () => __awaiter(void 0, void 0, void 0, function* () {
    const clearRedis = bot_1.client.guilds.cache.map((guild) => __awaiter(void 0, void 0, void 0, function* () {
        const uploadingMapKey = kies_1.redisKey.struct(kies_1.groupsKey.uploadingMap, [guild.id]);
        yield redis_1.redis.del(uploadingMapKey);
    }));
    yield Promise.all(clearRedis);
});
exports.clearRedisOnStart = clearRedisOnStart;
