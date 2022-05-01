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
const pubGame_1 = require("../../api/ghost/pubGame");
const pauseLobbyWatcher_1 = require("../../api/lobbyWatcher/pauseLobbyWatcher");
const resetCommandHubState_1 = require("../../api/lobbyWatcher/resetCommandHubState");
const resumeLobbyWatcher_1 = require("../../api/lobbyWatcher/resumeLobbyWatcher");
const settingsApi_1 = require("../../api/lobbyWatcher/settingsApi");
const hostGame_1 = require("../../components/buttons/hostGame");
const refreshWatcher_1 = require("../../components/buttons/refreshWatcher");
const showConfigSelector_1 = require("../../components/buttons/showConfigSelector");
const queries_1 = require("../../db/queries");
const events_1 = require("../../utils/events");
const globals_1 = require("../../utils/globals");
const lobbyParser_1 = require("../../utils/lobbyParser");
const log_1 = require("../../utils/log");
module.exports = {
    id: globals_1.buttonId.hostGame,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.update({
                components: [
                    new discord_js_1.MessageActionRow().addComponents((0, hostGame_1.hostGameButtonLoading)(), (0, showConfigSelector_1.showConfigSelectorButtonDefault)({ disabled: true }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                ],
            });
            const games = yield (0, lobbyParser_1.getCurrentLobbies)(interaction.guildId);
            if (games.some((game) => game.botid === globals_1.ghostGuildBotId)) {
                (0, log_1.log)("[host game button] lobby exist");
                yield interaction.message.edit({
                    components: [
                        new discord_js_1.MessageActionRow().addComponents((0, hostGame_1.hostGameButtonError)({ label: "Lobby already exist" }), (0, showConfigSelector_1.showConfigSelectorButtonDefault)({ disabled: true }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                    ],
                });
                (0, resetCommandHubState_1.resetCommandHubState)(interaction.message);
                return;
            }
            const resumeLobbyKey = yield (0, pauseLobbyWatcher_1.pauseLobbyWatcher)(interaction.guildId, 10000);
            const result = yield (0, pubGame_1.pubGame)(globals_1.production ? "res publica game" : "test");
            switch (result) {
                case "success":
                    const settings = yield (0, settingsApi_1.getLobbyWatcherSettings)(interaction.guildId);
                    yield (0, queries_1.createLobbyGame)(globals_1.ghostGuildBotId, settings && settings.lastLoadedMap);
                    (0, log_1.log)("[host game button] temp lobby created");
                    globals_1.botStatusVariables.lobbyCount = globals_1.botStatusVariables.lobbyCount + 1;
                    events_1.botEvents.emit("update" /* update */);
                    (0, log_1.log)("[host game button] send success");
                    yield interaction.message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents((0, hostGame_1.hostGameButtonSuccess)(), (0, showConfigSelector_1.showConfigSelectorButtonDefault)({ disabled: true }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                        ],
                    });
                    break;
                case "timeout":
                case "error":
                case "uknown":
                    (0, log_1.log)("[host game button] send error/uknown");
                    yield interaction.message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents((0, hostGame_1.hostGameButtonError)({ label: "No config loaded" }), (0, showConfigSelector_1.showConfigSelectorButtonDefault)({ disabled: true }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                        ],
                    });
                    break;
                case null:
                    (0, log_1.log)("[host game button] send null");
                    yield interaction.message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents((0, hostGame_1.hostGameButtonError)(), (0, showConfigSelector_1.showConfigSelectorButtonDefault)({ disabled: true }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                        ],
                    });
                    break;
            }
            yield (0, resetCommandHubState_1.resetCommandHubState)(interaction.message);
            yield (0, resumeLobbyWatcher_1.resumeLobbyWatcher)(interaction.guildId);
            clearTimeout(resumeLobbyKey);
        });
    },
};
