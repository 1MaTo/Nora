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
const pauseLobbyWatcher_1 = require("../../api/lobbyWatcher/pauseLobbyWatcher");
const resetCommandHubState_1 = require("../../api/lobbyWatcher/resetCommandHubState");
const resumeLobbyWatcher_1 = require("../../api/lobbyWatcher/resumeLobbyWatcher");
const hostGame_1 = require("../../components/buttons/hostGame");
const refreshWatcher_1 = require("../../components/buttons/refreshWatcher");
const showConfigSelector_1 = require("../../components/buttons/showConfigSelector");
const mapConfigSelector_1 = require("../../components/selectMenus/mapConfigSelector");
const globals_1 = require("../../utils/globals");
const lobbyParser_1 = require("../../utils/lobbyParser");
const requestToGuiServer_1 = require("../../utils/requestToGuiServer");
module.exports = {
    id: globals_1.buttonId.showConfigSelector,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const hostButtonPrev = interaction.message.resolveComponent(globals_1.buttonId.hostGame);
            const currentHostButton = hostButtonPrev
                ? hostButtonPrev.setDisabled(true)
                : (0, hostGame_1.hostGameButtonDefault)({ disabled: true });
            yield interaction.update({
                components: [
                    new discord_js_1.MessageActionRow().addComponents(currentHostButton, (0, showConfigSelector_1.showConfigSelectorButtonLoading)(), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                ],
            });
            const resumeLobbyKey = yield (0, pauseLobbyWatcher_1.pauseLobbyWatcher)(interaction.guildId, 15000);
            const games = yield (0, lobbyParser_1.getCurrentLobbies)(interaction.guildId);
            //  Cant loading configs when lobby exist
            if (games.some((game) => game.botid === globals_1.ghostGuildBotId)) {
                yield interaction.message.edit({
                    components: [
                        new discord_js_1.MessageActionRow().addComponents(currentHostButton, (0, showConfigSelector_1.showConfigSelectorButtonError)({
                            label: "Cant load config when lobby exist",
                            disabled: true,
                        }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                    ],
                });
                yield (0, resetCommandHubState_1.resetCommandHubState)(interaction.message);
                clearTimeout(resumeLobbyKey);
                yield (0, resumeLobbyWatcher_1.resumeLobbyWatcher)(interaction.guildId);
                return;
            }
            const configs = yield (0, requestToGuiServer_1.getConfigListFromGhost)();
            //  Network error
            if (!configs) {
                interaction.message.edit({
                    components: [
                        new discord_js_1.MessageActionRow().addComponents(currentHostButton, (0, showConfigSelector_1.showConfigSelectorButtonError)({
                            label: "Network error",
                            disabled: true,
                        }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                    ],
                });
                yield (0, resetCommandHubState_1.resetCommandHubState)(interaction.message);
                clearTimeout(resumeLobbyKey);
                yield (0, resumeLobbyWatcher_1.resumeLobbyWatcher)(interaction.guildId);
                return;
            }
            //  No configs exist for load
            if (configs.length === 0) {
                interaction.message.edit({
                    components: [
                        new discord_js_1.MessageActionRow().addComponents(currentHostButton, (0, showConfigSelector_1.showConfigSelectorButtonError)({
                            label: "No configs found",
                            disabled: true,
                        }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                    ],
                });
                yield (0, resetCommandHubState_1.resetCommandHubState)(interaction.message);
                clearTimeout(resumeLobbyKey);
                yield (0, resumeLobbyWatcher_1.resumeLobbyWatcher)(interaction.guildId);
                return;
            }
            //  All good, create config selector
            interaction.message.edit({
                components: [
                    new discord_js_1.MessageActionRow().addComponents(currentHostButton, (0, showConfigSelector_1.showConfigSelectorButtonLoading)({
                        disabled: true,
                        label: "Selecting map...",
                    }), (0, refreshWatcher_1.refreshWatcherButtonDefault)(), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                    new discord_js_1.MessageActionRow().addComponents((0, mapConfigSelector_1.mapConfigSelectorDefault)({ options: configs })),
                ],
            });
            return;
        });
    },
};
