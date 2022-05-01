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
exports.resetCommandHubState = void 0;
const discord_js_1 = require("discord.js");
const hostGame_1 = require("../../components/buttons/hostGame");
const refreshWatcher_1 = require("../../components/buttons/refreshWatcher");
const showConfigSelector_1 = require("../../components/buttons/showConfigSelector");
const queries_1 = require("../../db/queries");
const globals_1 = require("../../utils/globals");
const log_1 = require("../../utils/log");
const sleep_1 = require("../../utils/sleep");
const resetCommandHubState = (message, delay = 2000, config) => __awaiter(void 0, void 0, void 0, function* () {
    const lobbyList = yield (0, queries_1.getLobbyList)();
    const isLobbyExist = lobbyList && lobbyList.some((lobby) => lobby.botid === globals_1.ghostGuildBotId);
    yield (0, sleep_1.sleep)(delay);
    try {
        yield message.edit({
            components: [
                new discord_js_1.MessageActionRow().addComponents(isLobbyExist ? (0, hostGame_1.hostGameButtonSuccess)() : (0, hostGame_1.hostGameButtonDefault)(), config
                    ? config.result === "success"
                        ? (0, showConfigSelector_1.showConfigSelectorButtonSuccess)({ label: config.text })
                        : (0, showConfigSelector_1.showConfigSelectorButtonError)({ label: config.text })
                    : (0, showConfigSelector_1.showConfigSelectorButtonDefault)({ disabled: isLobbyExist }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
            ],
        });
        (0, log_1.log)("[reset command hub] hub reset complete");
        return;
    }
    catch (err) {
        (0, log_1.log)("[reset command hub] cant edit msg");
        return;
    }
});
exports.resetCommandHubState = resetCommandHubState;
