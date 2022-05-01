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
exports.pauseLobbyWatcher = void 0;
const globals_1 = require("../../utils/globals");
const sleep_1 = require("../../utils/sleep");
const resumeLobbyWatcher_1 = require("./resumeLobbyWatcher");
const settingsApi_1 = require("./settingsApi");
const pauseLobbyWatcher = (guildID, delay) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield (0, settingsApi_1.getLobbyWatcherSettings)(guildID);
    if (!settings)
        return;
    settings.paused = true;
    clearTimeout(globals_1.timeOutKeys.get("lobby-watcher-pause"));
    const timeoutKey = delay && setTimeout(() => (0, resumeLobbyWatcher_1.resumeLobbyWatcher)(guildID), delay);
    globals_1.timeOutKeys.set("lobby-watcher-pause", timeoutKey);
    yield (0, settingsApi_1.updateLobbyWatcherSettings)(guildID, Object.assign({}, settings));
    yield (0, sleep_1.sleep)(settings.delay);
    return timeoutKey || null;
});
exports.pauseLobbyWatcher = pauseLobbyWatcher;
