import { getGamesCountInfo } from "../../db/queries";
import { searchMapConfigByMapName } from "../../utils/mapConfig";

export const getTotalGamesStats = async (
  guildID: string,
  nickname: string
): Promise<Array<gamesCountInfo> | null> => {
  const games = await getGamesCountInfo(nickname);
  if (!games) return null;

  const filterSpectators = await Promise.all(
    games.map(async (game) => {
      const config = await searchMapConfigByMapName(game.map, guildID);

      if (!config) return game;

      const spectatorTeam = config.slotMap.findIndex(
        (team) => team.name.toLowerCase() === "spectators"
      );

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
    })
  );

  const actualGames = filterSpectators.filter(
    (game) => game !== null
  ) as Array<gamesCountInfo>;

  if (!actualGames.length) return null;

  return actualGames;
};
