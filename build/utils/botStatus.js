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
exports.updateStatusInfo = exports.changeBotStatus = void 0;
const bot_1 = require("../bot");
const globals_1 = require("./globals");
const log_1 = require("./log");
const changeBotStatus = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!globals_1.production)
            return;
        bot_1.client.user.setPresence({ activities: [{ name: message }] });
        return;
    }
    catch (error) {
        (0, log_1.log)(error);
        return;
    }
});
exports.changeBotStatus = changeBotStatus;
const updateStatusInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const ghost = `Ghost: ${globals_1.botStatusVariables.ghost ? "✅" : "❌"}`;
    if (!globals_1.botStatusVariables.ghost)
        return yield (0, exports.changeBotStatus)(`${ghost}`);
    const lobby = globals_1.botStatusVariables.lobbyCount
        ? ` | Lobby: ${(0, globals_1.numberToEmoji)(globals_1.botStatusVariables.lobbyCount)}`
        : "";
    const games = globals_1.botStatusVariables.gameCount
        ? ` | Games: ${(0, globals_1.numberToEmoji)(globals_1.botStatusVariables.gameCount)}`
        : "";
    yield (0, exports.changeBotStatus)(`${ghost}${lobby}${games}`);
});
exports.updateStatusInfo = updateStatusInfo;
