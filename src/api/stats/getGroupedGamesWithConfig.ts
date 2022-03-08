import { uniqueFromArray } from "../../utils/uniqueFromArray";

export const getGroupedGamesWithConfig = (games: Array<gamesCountInfo>) => {
  const maps = uniqueFromArray(games.map((game) => game.map));

  const groupedGames = maps.reduce((arr, mapName) => {
    const allMaps = games.filter((game) => game.map === mapName);
    return [
      ...arr,
      {
        map: mapName,
        totalGames: allMaps.reduce((count, game) => count + game.gamesCount, 0),
        versions: allMaps.map((map) => {
          return {
            gamesCount: map.gamesCount,
            mapVersion: map.mapVersion || mapName,
          };
        }),
      },
    ];
  }, []);

  return {
    totalGamesCount: groupedGames.reduce(
      (count: number, group: any) => count + group.totalGames,
      0
    ),
    groupedGames,
  };
};
