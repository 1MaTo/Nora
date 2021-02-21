import { palette } from "../utils/globals";
import { getPassedTime } from "../utils/timePassed";

export const gameStatsResults = (gameData: gameDataByIdsGamestats) => {
  return {
    title: gameData.gamename,
    color: gameData.winnerTeam ? palette.green : null,
    fields: gameData.players.map((team, index) => {
      return {
        name: team.teamName,
        value: team.teamPlayers
          .map((player) =>
            gameData.winnerTeam === index ? `🏆 ${player.name}` : player.name
          )
          .join("\n"),
        inline: true,
      };
    }),
    author: {
      name: gameData.map,
    },
    footer: {
      text: getPassedTime(0, gameData.duration * 1000),
    },
    timestamp: new Date(gameData.datetime),
  };
};
