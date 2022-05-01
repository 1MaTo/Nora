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
exports.stop = void 0;
const response_1 = require("../../../embeds/response");
const globals_1 = require("../../../utils/globals");
const isRunning_1 = require("../../lobbyWatcher/isRunning");
const stopLobbyWatcher_1 = require("../../lobbyWatcher/stopLobbyWatcher");
const stop = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const lobbyInfo = yield (0, isRunning_1.isRunning)(interaction.guildId);
    if (lobbyInfo) {
        yield (0, stopLobbyWatcher_1.stopLobbyWatcher)(interaction.guildId);
        yield interaction.editReply({
            embeds: [(0, response_1.success)("Lobby watcher stoped")],
        });
    }
    else {
        yield interaction.editReply({
            embeds: [(0, response_1.warning)("Lobby watcher isn't running on this server")],
        });
    }
    setTimeout(() => interaction.deleteReply(), globals_1.ghostCmd.deleteMessageTimeout);
});
exports.stop = stop;
