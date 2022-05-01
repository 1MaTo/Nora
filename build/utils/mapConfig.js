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
exports.deleteMapConfig = exports.updateMapConfigOptions = exports.createOrUpdateMapConfig = exports.getGuildMapConfigs = exports.searchMapConfigByName = exports.searchMapConfigByMapName = exports.defaultOptions = void 0;
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
exports.defaultOptions = {
    ranking: false,
    spectatorLivesMatter: false,
};
const searchMapConfigByMapName = (mapName, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const configs = yield (0, exports.getGuildMapConfigs)(guildID);
    const config = configs.find((cfg) => mapName.match(new RegExp(cfg.name, "i")));
    return config;
});
exports.searchMapConfigByMapName = searchMapConfigByMapName;
const searchMapConfigByName = (configName, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const configs = yield (0, exports.getGuildMapConfigs)(guildID);
    const config = configs.find((cfg) => cfg.name === configName);
    return config;
});
exports.searchMapConfigByName = searchMapConfigByName;
const getGuildMapConfigs = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.mapConfig, [guildID]);
    const results = yield redis_1.redis.get(key);
    return results ? results : [];
});
exports.getGuildMapConfigs = getGuildMapConfigs;
const createOrUpdateMapConfig = (guildID, newConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const guildConfigs = yield (0, exports.getGuildMapConfigs)(guildID);
    const configIndex = guildConfigs.findIndex((cfg) => cfg.name === newConfig.name);
    const key = kies_1.redisKey.struct(kies_1.groupsKey.mapConfig, [guildID]);
    if (configIndex === -1) {
        yield redis_1.redis.set(key, [
            ...guildConfigs,
            Object.assign(Object.assign({}, newConfig), { options: exports.defaultOptions }),
        ]);
        return true;
    }
    guildConfigs.splice(configIndex - 1, 1, Object.assign(Object.assign({}, newConfig), { options: guildConfigs[configIndex].options }));
    yield redis_1.redis.set(key, guildConfigs);
    return false;
});
exports.createOrUpdateMapConfig = createOrUpdateMapConfig;
const updateMapConfigOptions = (guildID, configName, configOption) => __awaiter(void 0, void 0, void 0, function* () {
    const guildConfigs = yield (0, exports.getGuildMapConfigs)(guildID);
    const configIndex = guildConfigs.findIndex((cfg) => cfg.name === configName);
    if (configIndex === -1)
        return false;
    const key = kies_1.redisKey.struct(kies_1.groupsKey.mapConfig, [guildID]);
    guildConfigs[configIndex].options[configOption.fieldName] =
        configOption.value;
    yield redis_1.redis.set(key, guildConfigs);
    return true;
});
exports.updateMapConfigOptions = updateMapConfigOptions;
const deleteMapConfig = (guildID, configName) => __awaiter(void 0, void 0, void 0, function* () {
    const guildConfigs = yield (0, exports.getGuildMapConfigs)(guildID);
    const configIndex = guildConfigs.findIndex((cfg) => cfg.name === configName);
    if (configIndex === -1)
        return false;
    const key = kies_1.redisKey.struct(kies_1.groupsKey.mapConfig, [guildID]);
    guildConfigs.splice(configIndex - 1, 1);
    redis_1.redis.set(key, guildConfigs);
    return true;
});
exports.deleteMapConfig = deleteMapConfig;
