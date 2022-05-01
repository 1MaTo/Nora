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
exports.getTotalGamesStats = void 0;
const queries_1 = require("../../db/queries");
const mapConfig_1 = require("../../utils/mapConfig");
const getTotalGamesStats = (guildID, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield (0, queries_1.getGamesCountInfo)(nickname);
    if (!games)
        return null;
    const filterSpectators = yield Promise.all(games.map((game) => __awaiter(void 0, void 0, void 0, function* () {
        const config = yield (0, mapConfig_1.searchMapConfigByMapName)(game.map, guildID);
        if (!config)
            return game;
        const spectatorTeam = config.slotMap.findIndex((team) => team.name.toLowerCase() === "spectators");
        const noSpecGames = game.teams.reduce((arr, team, index) => {
            return team === spectatorTeam ? arr : [...arr, index];
        }, []);
        if (!noSpecGames.length) {
            return null;
        }
        return {
            gamesCount: noSpecGames.length,
            map: config.name,
            gamesId: game.gamesID.filter((_, index) => noSpecGames.includes(index)),
            teams: game.teams.filter((_, index) => noSpecGames.includes(index)),
            mapVersion: game.map,
        };
    })));
    const actualGames = filterSpectators.filter((game) => game !== null);
    if (!actualGames.length)
        return null;
    return actualGames;
});
exports.getTotalGamesStats = getTotalGamesStats;
