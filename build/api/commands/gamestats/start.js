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
exports.start = void 0;
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const isRunning_1 = require("../../gamestats/isRunning");
const startGamestats_1 = require("../../gamestats/startGamestats");
const start = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const gamestatsSetting = yield (0, isRunning_1.isRunning)(interaction.guildId);
    if (gamestatsSetting) {
        return (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.warning)("Gamestats already running")],
        }, globals_1.msgDeleteTimeout.default);
    }
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const result = yield (0, startGamestats_1.startGamestats)(interaction.guildId, channel.id, 5000);
    if (result) {
        return (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.success)("Gamestats started")] }, globals_1.msgDeleteTimeout.default);
    }
    else {
        return (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.error)("Gamestats start error")] }, globals_1.msgDeleteTimeout.default);
    }
});
exports.start = start;
