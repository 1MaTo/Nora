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
const discord_js_1 = require("discord.js");
const unhostGame_1 = require("../../api/ghost/unhostGame");
const pauseLobbyWatcher_1 = require("../../api/lobbyWatcher/pauseLobbyWatcher");
const resetLobbyHubState_1 = require("../../api/lobbyWatcher/resetLobbyHubState");
const resumeLobbyWatcher_1 = require("../../api/lobbyWatcher/resumeLobbyWatcher");
const startGame_1 = require("../../components/buttons/startGame");
const unhostGame_2 = require("../../components/buttons/unhostGame");
const queries_1 = require("../../db/queries");
const globals_1 = require("../../utils/globals");
module.exports = {
    id: globals_1.buttonId.unhostGame,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.update({
                components: [
                    new discord_js_1.MessageActionRow().addComponents((0, startGame_1.startGameButtonDefault)({ disabled: true }), (0, unhostGame_2.unhostGameButtonLoading)()),
                ],
            });
            const resumeLobbyKey = yield (0, pauseLobbyWatcher_1.pauseLobbyWatcher)(interaction.guildId, 10000);
            const result = yield (0, unhostGame_1.unhostGame)();
            switch (result) {
                case "success":
                case "timeout":
                    yield (0, queries_1.clearLobbyGame)(globals_1.ghostGuildBotId);
                    yield interaction.message.delete();
                    break;
                case "error":
                case "uknown":
                    yield interaction.message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents((0, startGame_1.startGameButtonDefault)({ disabled: true }), (0, unhostGame_2.unhostGameButtonError)({ label: "This game already unhosted" })),
                        ],
                    });
                    break;
                case null:
                    yield interaction.message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents((0, startGame_1.startGameButtonDefault)({ disabled: true }), (0, unhostGame_2.unhostGameButtonError)()),
                        ],
                    });
                    break;
            }
            clearTimeout(resumeLobbyKey);
            yield (0, resetLobbyHubState_1.resetLobbyHubState)(interaction.message);
            (0, resumeLobbyWatcher_1.resumeLobbyWatcher)(interaction.guildId);
        });
    },
};
