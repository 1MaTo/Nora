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
exports.load = void 0;
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const loadMap_1 = require("../../ghost/loadMap");
const load = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, loadMap_1.loadMap)(interaction.options.getString("map"));
    switch (result) {
        case "success":
        case "timeout":
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.success)(`Config loaded`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
        case "error":
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.warning)(`Can not load this config`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
        case "uknown":
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.warning)(`No maps found`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
        case null:
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.error)(`Network error`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
    }
});
exports.load = load;