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
const startGame_1 = require("../../api/ghost/startGame");
const pauseLobbyWatcher_1 = require("../../api/lobbyWatcher/pauseLobbyWatcher");
const resetLobbyHubState_1 = require("../../api/lobbyWatcher/resetLobbyHubState");
const resumeLobbyWatcher_1 = require("../../api/lobbyWatcher/resumeLobbyWatcher");
const startGame_2 = require("../../components/buttons/startGame");
const unhostGame_1 = require("../../components/buttons/unhostGame");
const events_1 = require("../../utils/events");
const globals_1 = require("../../utils/globals");
const lobbyParser_1 = require("../../utils/lobbyParser");
const notifications_1 = require("../../utils/notifications");
module.exports = {
    id: globals_1.buttonId.startGame,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = interaction.message;
            const resumeWatcherKey = yield (0, pauseLobbyWatcher_1.pauseLobbyWatcher)(interaction.guildId, 10000);
            yield interaction.update({
                components: [
                    new discord_js_1.MessageActionRow().addComponents((0, startGame_2.startGameButtonLoading)({ label: "Starting..." }), (0, unhostGame_1.unhostGameButtonDefault)({ disabled: true })),
                ],
            });
            const games = yield (0, lobbyParser_1.getCurrentLobbies)(interaction.guildId);
            if (games.length === 0) {
                yield message.edit({
                    components: [
                        new discord_js_1.MessageActionRow().addComponents((0, startGame_2.startGameButtonError)({ label: "This game not exist" }), (0, unhostGame_1.unhostGameButtonDefault)({ disabled: true })),
                    ],
                });
                (0, resumeLobbyWatcher_1.resumeLobbyWatcher)(interaction.guildId);
                clearTimeout(resumeWatcherKey);
                return;
            }
            const result = yield (0, startGame_1.startGame)(true);
            let game = null;
            switch (result) {
                case "success":
                    globals_1.botStatusVariables.gameCount = globals_1.botStatusVariables.gameCount + 1;
                    events_1.botEvents.emit("update" /* update */);
                    game = games.find((game) => game.gamename == result.replace(/[\[\]]/g, ""));
                    if (game) {
                        (0, notifications_1.pingUsersOnStart)(game, interaction.guildId);
                    }
                    yield message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents((0, startGame_2.startGameButtonSuccess)({ label: "Started" }), (0, unhostGame_1.unhostGameButtonDefault)({ disabled: true })),
                        ],
                    });
                    break;
                case "timeout":
                case "error":
                case "uknown":
                    globals_1.botStatusVariables.gameCount = globals_1.botStatusVariables.gameCount + 1;
                    events_1.botEvents.emit("update" /* update */);
                    game = games.find((game) => game.gamename == result.replace(/[\[\]]/g, ""));
                    if (game) {
                        (0, notifications_1.pingUsersOnStart)(game, interaction.guildId);
                    }
                    yield message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents((0, startGame_2.startGameButtonLoading)({ label: "Waiting for data..." }), (0, unhostGame_1.unhostGameButtonDefault)({ disabled: true })),
                        ],
                    });
                    break;
                case null:
                    yield message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents((0, startGame_2.startGameButtonError)(), (0, unhostGame_1.unhostGameButtonDefault)({ disabled: true })),
                        ],
                    });
                    break;
            }
            clearTimeout(resumeWatcherKey);
            yield (0, resetLobbyHubState_1.resetLobbyHubState)(message, 3000);
            (0, resumeLobbyWatcher_1.resumeLobbyWatcher)(interaction.guildId);
        });
    },
};
