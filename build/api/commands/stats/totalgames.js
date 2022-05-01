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
exports.totalgames = void 0;
const response_1 = require("../../../embeds/response");
const stats_1 = require("../../../embeds/stats");
const kies_1 = require("../../../redis/kies");
const redis_1 = require("../../../redis/redis");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const getGroupedGamesWithConfig_1 = require("../../stats/getGroupedGamesWithConfig");
const getTotalGamesStats_1 = require("../../stats/getTotalGamesStats");
const totalgames = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [
        interaction.guildId,
        interaction.user.id,
    ]);
    const user = (yield redis_1.redis.get(key));
    const nickName = interaction.options.getString("nickname") || (user && user.nickname);
    if (!nickName) {
        yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.warning)("No nickname")] }, globals_1.msgDeleteTimeout.default);
        return;
    }
    const games = yield (0, getTotalGamesStats_1.getTotalGamesStats)(interaction.guildId, nickName);
    if (!games) {
        yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.warning)(`No games for ${nickName}`)] }, globals_1.msgDeleteTimeout.long);
        return;
    }
    const groupedGamesData = (0, getGroupedGamesWithConfig_1.getGroupedGamesWithConfig)(games);
    yield (0, discordMessage_1.editReply)(interaction, {
        embeds: [(0, stats_1.totalGamesForNickname)(nickName, groupedGamesData)],
    }, globals_1.msgDeleteTimeout.long);
});
exports.totalgames = totalgames;
