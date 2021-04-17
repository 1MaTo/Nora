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
const slash_create_1 = require("slash-create");
const gamestats_1 = require("../commandsObjects/gamestats");
const response_1 = require("../embeds/response");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const discordChannel_1 = require("../utils/discordChannel");
const discordMessage_1 = require("../utils/discordMessage");
const globals_1 = require("../utils/globals");
const log_1 = require("../utils/log");
const timerFuncs_1 = require("../utils/timerFuncs");
class gamestats extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, gamestats_1.gamestatsCommand);
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && ctx.member.id !== globals_1.ownerID)
                return;
            const gamestatsSetting = yield isRunning(ctx.guildID);
            if (ctx.options.stop) {
                if (!gamestatsSetting) {
                    discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.warning("Nothing to stop") }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                yield stopGamestats(ctx.guildID);
                discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.success("Gamestats stoped") }, globals_1.msgDeleteTimeout.default);
                return;
            }
            if (ctx.options.start) {
                if (gamestatsSetting) {
                    discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.warning("Gamestats already running"),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                const channel = ((ctx.options.start["channel"] &&
                    (yield discordChannel_1.getTextChannel(ctx.options.start["channel"]))) ||
                    (yield discordChannel_1.getTextChannel(ctx.channelID))).id;
                yield startGamestats(ctx.guildID, channel, 5000);
                return;
            }
            return;
        });
    }
}
exports.default = gamestats;
const isRunning = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.gameStats, [guildID]);
    const result = yield redis_1.redis.get(key);
    return result;
});
const startGamestats = (guildID, channelID, delay) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = kies_1.redisKey.struct(kies_1.groupsKey.gameStats, [guildID]);
        const settings = {
            guildID: guildID,
            channelID: channelID,
            delay: delay,
        };
        yield redis_1.redis.set(key, settings);
        setTimeout(() => timerFuncs_1.gamestatsUpdater(settings.guildID), delay);
        yield discordMessage_1.sendResponse(channelID, { embed: response_1.success("Gamestats started") }, globals_1.msgDeleteTimeout.default);
        return;
    }
    catch (error) {
        log_1.log(error);
        yield discordMessage_1.sendResponse(channelID, { embed: error("Gamestats start error") }, globals_1.msgDeleteTimeout.default);
        return null;
    }
});
const stopGamestats = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.gameStats, [guildID]);
    yield redis_1.redis.del(key);
    return;
});
