import { stats } from "../utils/globals";
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
