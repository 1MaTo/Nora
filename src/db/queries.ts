import { stats } from "../utils/globals";
import { parseMapName } from "../utils/lobbyParser";
import { log } from "../utils/log";
import { searchMapConfigByMapName } from "../utils/mapConfig";
import { uniqueFromArray } from "../utils/uniqueFromArray";
import { makeQuery } from "./mysql";

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
): Promise<null | Array<gamesCountInfo>> => {
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

export const getFinishedGamesId = async () => {
  const query = `SELECT id from games`;
  const result = await makeQuery(query);
  return result ? result.map((game: any) => game.id) : null;
};

export const getPlayersByGameId = async (gamesID: Array<number>) => {
  const query = `
    SELECT 
        gameplayers.gameid,
        gameplayers.name, 
        gameplayers.team 
    FROM ghost.gameplayers
    where gameplayers.gameid in (${gamesID.join(",")}) 
    order by gameid, team`;

  const players = await makeQuery(query);

  return players as Array<{
    gameid: number;
    name: string;
    team: number;
  }> | null;
};

export const getGamesDataByIds = async (
  gamesID: Array<number>,
  guildID: string
): Promise<Array<gameDataByIdsGamestats> | null> => {
  try {
    const players = await getPlayersByGameId(gamesID);
    const query = `
    SELECT 
        id, 
        map, 
        datetime, 
        gamename, 
        duration 
    FROM games where id in (${gamesID.join(",")})`;
    const gamesData = await makeQuery(query);

    if (!gamesData.length || !players) return null;

    const parsedGamesData = await Promise.all(
      gamesData.map(
        async (game: {
          id: number;
          map: string;
          datetime: string;
          gamename: string;
          duration: number;
        }) => {
          const gamePlayers = players.filter(
            (player) => player.gameid === game.id
          );
          const teams = uniqueFromArray(
            gamePlayers.map((player) => player.team)
          );
          const parsedTeams = [];
          const mapConfig = await searchMapConfigByMapName(game.map, guildID);

          if (mapConfig)
            teams.forEach((team) =>
              mapConfig.slotMap[team] &&
              mapConfig.slotMap[team].name.toLowerCase() !== "spectators"
                ? parsedTeams.push(mapConfig.slotMap[team].name)
                : null
            );
          else teams.forEach((team) => parsedTeams.push(`Team ${team + 1}`));

          return {
            id: game.id,
            map: parseMapName(game.map),
            datetime: new Date(game.datetime),
            gamename: game.gamename.replace(/#\d+/g, "").trim(),
            duration: game.duration,
            players: parsedTeams.map((teamName, index) => {
              const teamPlayers = gamePlayers.filter(
                (player) => player.team === index
              );
              return { teamName, teamPlayers };
            }),
          };
        }
      )
    );
    if (!parsedGamesData) return null;
    return parsedGamesData as Array<gameDataByIdsGamestats>;
  } catch (error) {
    log(error);
    return null;
  }
};

export const saveMapStats = async (gameID: number, winTeam: number) => {
  const query = `INSERT INTO mapstats (gameid, winteam) VALUES(${gameID}, ${winTeam})`;
  try {
    const result = await makeQuery(query);
    return true;
  } catch (error) {
    log(error);
    return null;
  }
};
