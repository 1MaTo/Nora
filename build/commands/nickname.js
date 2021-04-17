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
const nickname_1 = require("../commandsObjects/nickname");
const queries_1 = require("../db/queries");
const response_1 = require("../embeds/response");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const discordMessage_1 = require("../utils/discordMessage");
const discordUser_1 = require("../utils/discordUser");
const globals_1 = require("../utils/globals");
class nickname extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, nickname_1.nicknameCommand);
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && ctx.member.id !== globals_1.ownerID)
                return;
            if (ctx.options.ping_on_start) {
                const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [
                    ctx.guildID,
                    ctx.member.id,
                ]);
                const userData = (yield redis_1.redis.get(key));
                if (userData) {
                    userData.settings.ping_on_start = ctx.options.ping_on_start["value"];
                    redis_1.redis.set(key, userData);
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.success(`Ping on start now ${ctx.options.ping_on_start["value"]}`),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.warning("No binded nicknames"),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            if (ctx.options.bind) {
                const nick = ctx.options.bind["nickname"];
                const isFree = yield freeNickname(nick, ctx.guildID);
                if (!isFree) {
                    const nicks = yield queries_1.getNicknames();
                    const member = yield discordUser_1.getMember(ctx.guildID, ctx.member.id);
                    yield member.send({
                        embed: response_1.info(`ALL AVAILABLE NICKNAMES\n----------------------\n${nicks.join("\n")}`),
                    });
                    yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.warning(`Bad nickname`) }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                if (typeof isFree === "string") {
                    const member = yield discordUser_1.getMember(ctx.guildID, isFree);
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.warning(`This nickname binded to ${member.user.tag}`),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                yield bindNickname(nick, ctx.member.id, ctx.guildID);
                yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.success(`${nick} binded`) }, globals_1.msgDeleteTimeout.default);
                return;
            }
            if (ctx.options.unbind) {
                yield unbindNickname(ctx.member.id, ctx.guildID);
                yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.success(`Nick unbinded`) }, globals_1.msgDeleteTimeout.default);
                return;
            }
            if (ctx.options.show) {
                const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [
                    ctx.guildID,
                    ctx.member.id,
                ]);
                const userData = (yield redis_1.redis.get(key));
                if (!userData) {
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.warning("Nickname not binded"),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.body(userData.nickname, `${Object.entries(userData.settings)
                        .map((field) => `[${field[0]}]: \`${field[1]}\``)
                        .join("\n")}`),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            const user = yield discordUser_1.getMember(ctx.guildID, ctx.member.id);
            if (!user.hasPermission("ADMINISTRATOR")) {
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.error("Need to be admin for rebind"),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            if (ctx.options.rebind) {
                const nick = ctx.options.rebind["nickname"];
                const userID = ctx.options.rebind["user"];
                const isFree = yield freeNickname(nick, ctx.guildID);
                if (!isFree) {
                    yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.warning(`Bad nickname | This nickname is free`) }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                if (typeof isFree === "string") {
                    const member = yield discordUser_1.getMember(ctx.guildID, isFree);
                    yield unbindNickname(member.id, ctx.guildID);
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.info(`Unbind ${nick} from ${member.user.tag}`),
                    }, globals_1.msgDeleteTimeout.default);
                }
                yield bindNickname(nick, userID, ctx.guildID);
                const member = yield discordUser_1.getMember(ctx.guildID, userID);
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.success(`${nick} binded to ${member.user.tag}`),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            return;
        });
    }
}
exports.default = nickname;
const bindNickname = (nickname, userID, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [guildID, userID]);
    yield redis_1.redis.set(key, {
        nickname,
        discordID: userID,
        settings: globals_1.defaultUserData,
    });
    return true;
});
const unbindNickname = (userID, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [guildID, userID]);
    yield redis_1.redis.del(key);
    return true;
});
const freeNickname = (nickname, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const nicks = yield queries_1.getNicknames();
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
