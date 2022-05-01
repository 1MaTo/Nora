"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupedGamesWithConfig = void 0;
const uniqueFromArray_1 = require("../../utils/uniqueFromArray");
const getGroupedGamesWithConfig = (games) => {
    const maps = (0, uniqueFromArray_1.uniqueFromArray)(games.map((game) => game.map));
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
        totalGamesCount: groupedGames.reduce((count, group) => count + group.totalGames, 0),
        groupedGames,
    };
};
exports.getGroupedGamesWithConfig = getGroupedGamesWithConfig;
