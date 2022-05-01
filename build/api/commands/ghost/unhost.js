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
exports.unhost = void 0;
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const unhostGame_1 = require("../../ghost/unhostGame");
const unhost = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, unhostGame_1.unhostGame)();
    switch (result) {
        case "success":
        case "timeout":
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.success)(`Game unhosted`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
        case "error":
        case "uknown":
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.warning)(`Nothing to unhost`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
        case null:
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.error)(`Network error`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
    }
});
exports.unhost = unhost;
