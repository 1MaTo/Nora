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
exports.resetLobbyHubState = void 0;
const discord_js_1 = require("discord.js");
const startGame_1 = require("../../components/buttons/startGame");
const unhostGame_1 = require("../../components/buttons/unhostGame");
const globals_1 = require("../../utils/globals");
const log_1 = require("../../utils/log");
const sleep_1 = require("../../utils/sleep");
const resetLobbyHubState = (message, delay = 2000) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sleep_1.sleep)(delay);
    const startButton = message.resolveComponent(globals_1.buttonId.startGame) ||
        (0, startGame_1.startGameButtonDefault)();
    const unhostButton = message.resolveComponent(globals_1.buttonId.unhostGame) ||
        (0, unhostGame_1.unhostGameButtonDefault)();
    try {
        yield message.edit({
            components: [
                new discord_js_1.MessageActionRow().addComponents(startButton.style === "SUCCESS"
                    ? startButton
                    : (0, startGame_1.startGameButtonDefault)(), startButton.style === "SUCCESS"
                    ? unhostButton
                    : unhostButton.setDisabled(false)),
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
exports.resetLobbyHubState = resetLobbyHubState;
