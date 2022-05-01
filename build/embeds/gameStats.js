"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStatsResults = void 0;
const globals_1 = require("../utils/globals");
const timePassed_1 = require("../utils/timePassed");
const gameStatsResults = (gameData) => {
    return {
        title: gameData.gamename,
        color: gameData.winnerTeam !== null ? globals_1.palette.green : null,
        fields: gameData.players.map((team, index) => {
            return {
                name: team.teamName,
                value: team.teamPlayers
                    .map((player) => gameData.winnerTeam === index ? `🏆 ${player.name}` : player.name)
                    .join("\n"),
                inline: true,
            };
        }),
        author: {
            name: gameData.map,
        },
        footer: {
            text: (0, timePassed_1.getPassedTime)(0, gameData.duration * 1000),
        },
        timestamp: new Date(gameData.datetime),
    };
};
exports.gameStatsResults = gameStatsResults;
