import { asyncDb } from "./db";
import { parseMapName } from "./utils";

export const getGamesCount = async (nicknames, minIngameTime = 900) => {
    try {
        const result = await asyncDb.query(`
            SELECT 
                count(gameid) as gamesCount, 
                group_concat(gameid) as gamesId,  
                group_concat(team) as teams,
                map
            FROM ghost.gameplayers 
            inner join games on games.id = gameplayers.gameid
            where name in ("${nicknames.join('", "')}") and duration >= ${minIngameTime}
            group by map order by gamesCount desc`);
        if (!result.length) return null;
        return result.map(game => {
            return {
                ...game,
                gamesId: game.gamesId.split(","),
                teams: game.teams.split(","),
                map: parseMapName(game.map),
            };
        });
    } catch (error) {
        console.log(error);
        return null;
    }
};