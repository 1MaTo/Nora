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
const loadMapFromFile_1 = require("../../api/ghost/loadMapFromFile");
const pauseLobbyWatcher_1 = require("../../api/lobbyWatcher/pauseLobbyWatcher");
const resetCommandHubState_1 = require("../../api/lobbyWatcher/resetCommandHubState");
const resumeLobbyWatcher_1 = require("../../api/lobbyWatcher/resumeLobbyWatcher");
const settingsApi_1 = require("../../api/lobbyWatcher/settingsApi");
const hostGame_1 = require("../../components/buttons/hostGame");
const refreshWatcher_1 = require("../../components/buttons/refreshWatcher");
const showConfigSelector_1 = require("../../components/buttons/showConfigSelector");
const globals_1 = require("../../utils/globals");
const log_1 = require("../../utils/log");
module.exports = {
    id: globals_1.selectMenuId.selectMapConfigWatcherHub,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = interaction.message;
            const selectMenu = message.resolveComponent(globals_1.selectMenuId.selectMapConfigWatcherHub);
            const hostButton = message.resolveComponent(globals_1.buttonId.hostGame) ||
                (0, hostGame_1.hostGameButtonDefault)({ disabled: true });
            const showConfigButton = message.resolveComponent(globals_1.buttonId.showConfigSelector) ||
                (0, showConfigSelector_1.showConfigSelectorButtonLoading)();
            if (!selectMenu)
                return;
            yield interaction.update({
                components: [
                    new discord_js_1.MessageActionRow().addComponents(hostButton, showConfigButton, (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                    new discord_js_1.MessageActionRow().addComponents(selectMenu
                        .setDisabled(true)
                        .setPlaceholder(`Loading ${interaction.values[0]}...`)),
                ],
            });
            const resumeLobbyKey = yield (0, pauseLobbyWatcher_1.pauseLobbyWatcher)(interaction.guildId, 10000);
            const result = yield (0, loadMapFromFile_1.loadMapFromFile)(interaction.values[0]);
            switch (result) {
                case "success":
                case "timeout":
                    (0, log_1.log)("[select map config] success/timeout");
                    (0, settingsApi_1.updateLobbyWatcherSettings)(interaction.guildId, {
                        lastLoadedMap: interaction.values[0],
                        forceUpdate: true,
                    });
                    yield message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents(hostButton, (0, showConfigSelector_1.showConfigSelectorButtonSuccess)(), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                        ],
                    });
                    break;
                case "uknown":
                case "error":
                    (0, log_1.log)("[select map config] uknown/error");
                    yield message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents(hostButton, (0, showConfigSelector_1.showConfigSelectorButtonError)({ label: "Cant load this config" }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                        ],
                    });
                    break;
                case null:
                    (0, log_1.log)("[select map config] null");
                    yield message.edit({
                        components: [
                            new discord_js_1.MessageActionRow().addComponents(hostButton, (0, showConfigSelector_1.showConfigSelectorButtonError)(), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
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
