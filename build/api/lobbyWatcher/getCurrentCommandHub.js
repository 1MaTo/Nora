"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandHubState = void 0;
const discord_js_1 = require("discord.js");
const hostGame_1 = require("../../components/buttons/hostGame");
const refreshWatcher_1 = require("../../components/buttons/refreshWatcher");
const showConfigSelector_1 = require("../../components/buttons/showConfigSelector");
const getCommandHubState = (isLobbyExist) => {
    return [
        new discord_js_1.MessageActionRow().addComponents(isLobbyExist ? (0, hostGame_1.hostGameButtonSuccess)() : (0, hostGame_1.hostGameButtonDefault)(), (0, showConfigSelector_1.showConfigSelectorButtonDefault)({ disabled: isLobbyExist }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
    ];
};
exports.getCommandHubState = getCommandHubState;
