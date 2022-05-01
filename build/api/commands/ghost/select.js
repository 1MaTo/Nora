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
exports.select = void 0;
const discord_js_1 = require("discord.js");
const selectMapConfig_1 = require("../../../components/selectMenus/selectMapConfig");
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const requestToGuiServer_1 = require("../../../utils/requestToGuiServer");
const select = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const configs = yield (0, requestToGuiServer_1.getConfigListFromGhost)();
    if (!configs)
        return yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.error)("Network error")],
        }, globals_1.msgDeleteTimeout.short);
    if (configs.length === 0)
        return yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.info)("There are no configs in ghost")],
        }, globals_1.msgDeleteTimeout.short);
    yield (0, discordMessage_1.editReply)(interaction, {
        components: [
            new discord_js_1.MessageActionRow().addComponents((0, selectMapConfig_1.selectMapConfig)(configs)),
        ],
    }, globals_1.msgDeleteTimeout.info);
});
exports.select = select;
