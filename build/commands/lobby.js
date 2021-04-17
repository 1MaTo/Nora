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
const lobby_1 = require("../commandsObjects/lobby");
const lobby_2 = require("../embeds/lobby");
const response_1 = require("../embeds/response");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const discordChannel_1 = require("../utils/discordChannel");
const discordMessage_1 = require("../utils/discordMessage");
const globals_1 = require("../utils/globals");
const log_1 = require("../utils/log");
const timePassed_1 = require("../utils/timePassed");
const timerFuncs_1 = require("../utils/timerFuncs");
class lobby extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, lobby_1.lobbyCommand);
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && ctx.member.id !== globals_1.ownerID)
                return;
            const lobbyInfo = yield isRunning(ctx.guildID);
            if (ctx.options.stop) {
                if (lobbyInfo) {
                    yield stopLobbyWatcher(ctx.guildID);
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.success("Lobby watcher stoped"),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.warning("Lobby watcher isn't running on this server"),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            if (lobbyInfo) {
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.warning("Lobby watcher is already running on this server"),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            const channel = ((ctx.options.start["channel"] &&
                (yield discordChannel_1.getTextChannel(ctx.options.start["channel"]))) ||
                (yield discordChannel_1.getTextChannel(ctx.channelID))).id;
            const delay = ctx.options.start["delay"] || 10000;
            startLobbyWatcher(ctx.guildID, channel, delay);
            return;
        });
    }
}
exports.default = lobby;
const isRunning = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
    const result = yield redis_1.redis.get(key);
    return result;
});
const stopLobbyWatcher = (guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
    const settings = (yield redis_1.redis.get(key));
    if (settings) {
        const channel = yield discordChannel_1.getTextChannel(settings.channelID);
        const lobbiesToMsgID = settings.lobbysID.reduce((arr, curr) => [...arr, curr.messageID], []);
        yield channel.bulkDelete([settings.headerID, ...lobbiesToMsgID]);
    }
    yield redis_1.redis.del(key);
    return;
});
const startLobbyWatcher = (guildID, channelID, delay) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startTime = Date.now();
        const headerMsg = yield discordMessage_1.sendResponse(channelID, {
            embed: lobby_2.header(0, timePassed_1.getPassedTime(startTime, Date.now())),
        });
        const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
        redis_1.redis.set(key, {
            startTime: startTime,
            channelID: channelID,
            guildID: guildID,
            delay: delay,
            headerID: headerMsg.id,
            lobbysID: [],
        });
        yield discordMessage_1.sendResponse(channelID, { embed: response_1.success(`Lobby watcher started`) }, globals_1.msgDeleteTimeout.default);
        setTimeout(() => timerFuncs_1.lobbyWatcherUpdater(guildID), delay);
    }
    catch (error) {
        log_1.log(error);
        yield discordMessage_1.sendResponse(channelID, {
            embed: error(`Failed to start lobby watcher\n${error.message}`, globals_1.msgDeleteTimeout.default),
        });
    }
});
