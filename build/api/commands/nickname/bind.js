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
exports.bind = void 0;
const queries_1 = require("../../../db/queries");
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const discordUser_1 = require("../../../utils/discordUser");
const globals_1 = require("../../../utils/globals");
const bindNickname_1 = require("../../nickname/bindNickname");
const freeNickname_1 = require("../../nickname/freeNickname");
const bind = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const nick = interaction.options.getString("nickname");
    const isFree = yield (0, freeNickname_1.freeNickname)(nick, interaction.guildId);
    if (!isFree) {
        const nicks = yield (0, queries_1.getNicknames)();
        const findNicknames = nicks
            .filter((item) => new RegExp(nick, "i").test(item))
            .join("\n");
        if (findNicknames && findNicknames.length <= 4096) {
            return yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [
                    (0, response_1.body)(`Can't find nickname, maybe use one of this?`, findNicknames),
                ],
            }, globals_1.msgDeleteTimeout.long);
        }
        return yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.warning)(`Bad nickname`)] }, globals_1.msgDeleteTimeout.default);
    }
    if (typeof isFree === "string") {
        const member = yield (0, discordUser_1.getMember)(interaction.guildId, isFree);
        yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.warning)(`This nickname binded to ${member.user.tag}`)],
        }, globals_1.msgDeleteTimeout.default);
        return;
    }
    yield (0, bindNickname_1.bindNickname)(nick, interaction.user.id, interaction.guildId);
    yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.success)(`${nick} binded`)] }, globals_1.msgDeleteTimeout.default);
    return;
});
exports.bind = bind;
