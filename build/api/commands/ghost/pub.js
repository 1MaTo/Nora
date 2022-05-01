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
exports.pub = void 0;
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const events_1 = require("../../../utils/events");
const globals_1 = require("../../../utils/globals");
const lobbyParser_1 = require("../../../utils/lobbyParser");
const pubGame_1 = require("../../ghost/pubGame");
const pub = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield (0, lobbyParser_1.getCurrentLobbies)(interaction.guildId);
    if (games.some((game) => game.botid === globals_1.ghostGuildBotId)) {
        yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.warning)(`Lobby already exist`)],
        }, globals_1.msgDeleteTimeout.short);
        return;
    }
    const result = yield (0, pubGame_1.pubGame)(interaction.options.getString("gamename"));
    switch (result) {
        case "success":
        case "timeout":
            globals_1.botStatusVariables.lobbyCount = globals_1.botStatusVariables.lobbyCount + 1;
            events_1.botEvents.emit("update" /* update */);
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.success)(`Game hosted`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
        case "error":
        case "uknown":
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.warning)(`No config loaded`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
        case null:
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [(0, response_1.error)(`Network error`)],
            }, globals_1.msgDeleteTimeout.short);
            return;
    }
});
exports.pub = pub;
