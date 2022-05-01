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
exports.rebind = void 0;
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const discordUser_1 = require("../../../utils/discordUser");
const globals_1 = require("../../../utils/globals");
const bindNickname_1 = require("../../nickname/bindNickname");
const freeNickname_1 = require("../../nickname/freeNickname");
const unbindNickname_1 = require("../../nickname/unbindNickname");
const rebind = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
        return yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.error)("Need to be admin for rebind")],
        }, globals_1.msgDeleteTimeout.default);
    }
    const nick = interaction.options.getString("nickname");
    const userID = interaction.options.getUser("user").id;
    const isFree = yield (0, freeNickname_1.freeNickname)(nick, interaction.guildId);
    if (!isFree) {
        yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.warning)(`Bad nickname | This nickname is free`)] }, globals_1.msgDeleteTimeout.default);
        return;
    }
    if (typeof isFree === "string") {
        const member = yield (0, discordUser_1.getMember)(interaction.guildId, isFree);
        yield (0, unbindNickname_1.unbindNickname)(member.id, interaction.guildId);
        yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.info)(`Unbind ${nick} from ${member.user.tag}`)],
        });
    }
    yield (0, bindNickname_1.bindNickname)(nick, userID, interaction.guildId);
    const member = yield (0, discordUser_1.getMember)(interaction.guildId, userID);
    yield (0, discordMessage_1.editReply)(interaction, {
        embeds: [(0, response_1.success)(`${nick} binded to ${member.user.tag}`)],
    }, globals_1.msgDeleteTimeout.default);
    return;
});
exports.rebind = rebind;
