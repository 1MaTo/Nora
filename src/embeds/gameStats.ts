import { palette } from "../utils/globals";
import { getPassedTime } from "../utils/timePassed";

export const gameStatsPoll = (
  gameData: gameDataByIdsGamestats,
  winTeam = null,
  color: string = null
) => {
  return {
    title: gameData.gamename,
    color: color,
    fields: gameData.players.map((team, index) => {
      return {
        name: team.teamName,
        value: team.teamPlayers
          .map((player) =>
            winTeam === index ? `🏆 ${player.name}` : player.name
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
