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
exports.winrate = void 0;
const response_1 = require("../../../embeds/response");
const kies_1 = require("../../../redis/kies");
const redis_1 = require("../../../redis/redis");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const log_1 = require("../../../utils/log");
const MMDstats_1 = require("../../../utils/MMDstats");
const nicknameToDiscordUser_1 = require("../../../utils/nicknameToDiscordUser");
const sendWinrateInteractiveEmbed_1 = require("../../stats/sendWinrateInteractiveEmbed");
const winrate = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [
        interaction.guildId,
        interaction.user.id,
    ]);
    const user = (yield redis_1.redis.get(key));
    const nickname = interaction.options.getString("nickname") || (user && user.nickname);
    if (!nickname) {
        yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.warning)("No nickname")] }, globals_1.msgDeleteTimeout.default);
        return;
    }
    const stats = yield (0, MMDstats_1.getWinStats)(nickname);
    if (!stats) {
        yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.warning)("No games for this nicknames")],
        }, globals_1.msgDeleteTimeout.default);
        return;
    }
    const member = yield (0, nicknameToDiscordUser_1.getDiscordUsersFromNicknames)([nickname], interaction.guildId);
    try {
        yield (0, sendWinrateInteractiveEmbed_1.sendWinrateInteractiveEmbed)(interaction, stats, member[0] &&
            member[0].user.avatarURL({ format: "png", dynamic: true, size: 512 }));
    }
    catch (err) {
        (0, log_1.log)("[winrate] embed error");
    }
});
exports.winrate = winrate;
