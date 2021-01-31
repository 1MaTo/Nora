import { stats } from "../utils/globals";
import { parseMapName } from "../utils/lobbyParser";
import { log } from "../utils/log";
import { dbQuery, makeQuery } from "./mysql";

export const getLobbyList = async (): Promise<Array<lobbyGame>> | null => {
  const query = `SELECT * from gamelist`;
  return await makeQuery(query);
};

export const getPlayerWinrate = async (
  nickname: string,
  mapName: string
): Promise<string | null> => {
  const gamesPlayed = await getStatsGameCount(nickname, mapName);

  if (gamesPlayed < stats.gamesToBeRanked) return null;

  const fromGamesWithNicknames = `
    from gameplayers
    inner join games on games.id = gameplayers.gameid
    inner join mapstats on mapstats.gameid = games.id
    where gameplayers.name in ("${nickname}") and map like '%${mapName}%'`;

  const query = `
    select 
    round(((select count(*) ${fromGamesWithNicknames} and winteam = team) / count(games.id) * 100)) as winrate
    ${fromGamesWithNicknames};`;

  const result = await makeQuery(query);

  return result ? result[0].winrate : null;
};

export const getStatsGameCount = async (
  nickname: string,
  mapName: string
): Promise<number> => {
  const query = `
    select count(*) as count
    from gameplayers
    inner join games on games.id = gameplayers.gameid
    inner join mapstats on mapstats.gameid = games.id
    where gameplayers.name in ("${nickname}") and map like '%${mapName}%';`;

  const result = await makeQuery(query);

  return result ? result.count : 0;
};

export const getNicknames = async () => {
  const query = `SELECT DISTINCT name FROM gameplayers where name != " " order by name;`;

  const result = await makeQuery(query);

  return result && result.length > 0
    ? result.map((item: any) => item.name)
    : null;
};

export const getGamesCountInfo = async (
  nickname: string,
  minIngameTime: number = 900
): Promise<null | gamesCountInfo> => {
  const query = `
    SELECT 
        count(gameid) as gamesCount, 
        group_concat(gameid) as gamesId,  
        group_concat(team) as teams,
        map
    FROM ghost.gameplayers 
    inner join games on games.id = gameplayers.gameid
    where name = '${nickname}' and duration >= ${minIngameTime}
    group by map order by gamesCount desc`;

  const result = await makeQuery(query);

  return (
    result &&
    result.map(
      (game: {
        gamesCount: number;
        gamesId: string;
        teams: string;
        map: string;
      }) => {
        return {
          ...game,
          gamesID: game.gamesId.split(","),
          teams: game.teams.split(","),
          map: parseMapName(game.map),
        };
      }
    )
  );
};
