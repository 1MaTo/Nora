import { asyncDb } from "./db";
import { parseMapName } from "./utils";
import { gamesToBeRanked } from "../../config.json";

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

export const getStatsGameCount = async (nicknames, map) => {
    try {
        const result = await asyncDb.query(`
        select count(*) as count
        from gameplayers
         inner join games on games.id = gameplayers.gameid
         inner join mapstats on mapstats.gameid = games.id
         where gameplayers.name in ("${nicknames.join(',"')}") and map like '%${map}%';`);
        if (!result.length) return null;
        return result.count;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getPlayerWinrate = async (nicknames, map) => {
    const gamesCount = await getStatsGameCount(nicknames, map);

    if (Number(gamesCount) < Number(gamesToBeRanked)) return null;

    try {
        const fromGamesWithNicknames = `
        from gameplayers
        inner join games on games.id = gameplayers.gameid
        inner join mapstats on mapstats.gameid = games.id
        where gameplayers.name in ("${nicknames.join(',"')}") and map like '%${map}%'`;

        const result = await asyncDb.query(`
        select 
        round(((select count(*)
        ${fromGamesWithNicknames} and winteam = team) / count(games.id) * 100)) as winrate
        ${fromGamesWithNicknames};`);

        return result[0].winrate;
    } catch (error) {
        console.log(error);
        return null;
    }
};
