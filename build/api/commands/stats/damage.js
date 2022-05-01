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
exports.damage = void 0;
const response_1 = require("../../../embeds/response");
const stats_1 = require("../../../embeds/stats");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const MMDstats_1 = require("../../../utils/MMDstats");
const damage = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const damageStats = yield (0, MMDstats_1.getLeaderBordByDamage)();
    if (!damageStats) {
        yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.warning)("No players for stats")] }, globals_1.msgDeleteTimeout.default);
        return;
    }
    yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, stats_1.leaderboardDamage)(damageStats)] }, globals_1.msgDeleteTimeout.info);
});
exports.damage = damage;
