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
exports.stop = void 0;
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const isRunning_1 = require("../../gamestats/isRunning");
const stopGamestats_1 = require("../../gamestats/stopGamestats");
const stop = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const gamestatsSetting = yield (0, isRunning_1.isRunning)(interaction.guildId);
    if (!gamestatsSetting) {
        return (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.warning)("Nothing to stop")],
        }, globals_1.msgDeleteTimeout.default);
    }
    yield (0, stopGamestats_1.stopGamestats)(interaction.guildId);
    return (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.success)("Gamestats stoped")] }, globals_1.msgDeleteTimeout.default);
});
exports.stop = stop;
