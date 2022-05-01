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
exports.collectGamesData = void 0;
const queries_1 = require("../db/queries");
const gameStats_1 = require("../embeds/gameStats");
const discordMessage_1 = require("./discordMessage");
const events_1 = require("./events");
const globals_1 = require("./globals");
const mapConfig_1 = require("./mapConfig");
const collectGamesData = (gamesID, channelID, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const gamesData = yield (0, queries_1.getGamesDataByIds)(gamesID, guildID);
    yield Promise.all(gamesData.map((game) => __awaiter(void 0, void 0, void 0, function* () {
        if (game.players.length < 2)
            return;
        const config = yield (0, mapConfig_1.searchMapConfigByMapName)(game.map, guildID);
        if (!config || config.options.ranking === false)
            return;
        sendGameResult(game, channelID);
    })));
});
exports.collectGamesData = collectGamesData;
const sendGameResult = (gameData, channelID) => __awaiter(void 0, void 0, void 0, function* () {
    if (globals_1.botStatusVariables.gameCount > 0) {
        globals_1.botStatusVariables.gameCount -= 1;
        events_1.botEvents.emit("update" /* update */);
    }
    yield (0, discordMessage_1.sendResponse)(channelID, {
        embeds: [(0, gameStats_1.gameStatsResults)(gameData)],
    });
});
