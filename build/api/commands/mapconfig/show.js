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
exports.show = void 0;
const mapconfig_1 = require("../../../embeds/mapconfig");
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const mapConfig_1 = require("../../../utils/mapConfig");
const show = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const cfgName = interaction.options.getString("name");
    if (cfgName) {
        const cfg = yield (0, mapConfig_1.searchMapConfigByName)(cfgName, interaction.guildId);
        if (cfg) {
            return yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, mapconfig_1.mapConfigInfo)(cfg)] }, globals_1.msgDeleteTimeout.long);
        }
        return yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.warning)(`Can't find ${cfgName}`)] }, globals_1.ghostCmd.deleteMessageTimeout);
    }
    const configs = yield (0, mapConfig_1.getGuildMapConfigs)(interaction.guildId);
    if (configs.length === 0) {
        return yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.warning)("No map configs found")] }, globals_1.ghostCmd.deleteMessageTimeout);
    }
    return yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, mapconfig_1.mapConfigList)(configs.map((cfg) => cfg.name))] }, globals_1.msgDeleteTimeout.long);
});
exports.show = show;
