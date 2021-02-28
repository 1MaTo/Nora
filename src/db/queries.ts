import { parseMapName } from "../utils/lobbyParser";
import { log } from "../utils/log";
import { searchMapConfigByMapName } from "../utils/mapConfig";
import { uniqueFromArray } from "../utils/uniqueFromArray";
import { makeQuery } from "./mysql";

export const getLobbyList = async (): Promise<Array<lobbyGame>> | null => {
  const query = `SELECT * from gamelist`;
  return await makeQuery(query);
};

export const getPlayerWinrateForLobbyWatcher = async (
  nickname: string
): Promise<string | null> => {
  const query = `
    select flag
    from w3mmdplayers 
    inner join gameplayers on 
        w3mmdplayers.gameid = gameplayers.gameid 
        and w3mmdplayers.pid = gameplayers.colour 
    inner join games on 
        games.id = gameplayers.gameid
    where category = "fbtmmd" 
        and team < 2 
            and flag in ("loser", "winner") 
        and gameplayers.name = "${nickname}"
        and duration >= 900`;

  const result = await makeQuery(query);

  if (!result || !result.length) return null;

  const parsed = result.map((obj: any) => obj.flag);

  const stats = parsed.reduce(
    (stat: playerWinrateStats, result: string) => {
      if (result === "loser") {
        stat.lose++;
      } else {
        stat.win++;
      }
      if (stat.streak.type === result) {
        stat.streak.count++;
      } else {
        stat.streak.type = result;
        stat.streak.count = 1;
      }
      return stat;
    },
    { win: 0, lose: 0, streak: { type: "winner", count: 0 } }
  ) as playerWinrateStats;

  return `${Math.round((stats.win / (stats.win + stats.lose)) * 100)}% | ${
    stats.win + stats.lose
  } | ${stats.streak.count} ${
    stats.streak.type == "winner"
      ? "<:winstreak:812779155334365184>"
      : "<:losestreak:812779155418644521>"
  }`;
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
  const query = `SELECT gameid as id from w3mmdplayers 
                inner join games on games.id = w3mmdplayers.gameid
                where flag in ("loser", "winner") group by gameid`;
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
            winnerTeam: await getWinnerTeamNumberFromId(game.id),
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

export const getWinnerTeamNumberFromId = async (
  gameID: number
): Promise<number | null> => {
  const query = `SELECT team from w3mmdplayers 
                inner join gameplayers on 
                  gameplayers.colour = w3mmdplayers.pid and 
                  gameplayers.gameid = w3mmdplayers.gameid
                where gameplayers.gameid=${gameID} and flag = "winner" group by team`;
  const result = await makeQuery(query);
  return result && (result[0].team as number);
};

// ********************* GAME STATISTIC QUERIES *********************

export const getGamesIdByPlayerNickname = async (nickname: string) => {
  const query = `SELECT w3mmdplayers.gameid
                FROM gameplayers
                left join w3mmdplayers on
                  w3mmdplayers.gameid = gameplayers.gameid 
                  and w3mmdplayers.pid = gameplayers.colour
                where gameplayers.name = "${nickname}" 
                  and gameplayers.team < 2
                  and w3mmdplayers.id`;
  const result = await makeQuery(query);
  return result && result.map((game: any) => game.gameid);
};

export const getGroupedGamesByGameid = async (games: number[]) => {
  const idToString = `"${games.join('","')}"`;
  const query = `select 
                gameplayers.gameid, 
                  group_concat(gameplayers.name) as nicknames, 
                  duration, 
                  group_concat(team) as team,
                  group_concat(colour) as colours,
                  group_concat(flag) as flag
                from games 
                inner join gameplayers on gameplayers.gameid = games.id
                  inner join w3mmdplayers on w3mmdplayers.gameid = games.id and w3mmdplayers.pid = gameplayers.colour
                where 
                games.id in (${idToString})
                and gameplayers.team < 2
                  and games.duration > 900
                  and w3mmdplayers.flag in ("loser", "winner")
                group by gameid, team`;
  const result = await makeQuery(query);
  if (!result) return null;

  const parsedResult = result.map((game: any) => {
    return {
      ...game,
      nicknames: game.nicknames.split(","),
      team: Number(game.team.split(",")[0]),
      colours: JSON.parse(`[${game.colours}]`),
      flag: game.flag.split(",")[0],
    };
  });
  return parsedResult;
};

export const checkPlayerWin = async (gameID: number, pid: number) => {
  const query = `select flag from w3mmdplayers where gameid = ${gameID} and pid = ${pid}`;
  const result = await makeQuery(query);
  if (!result) return null;
  return result === "winner";
};

export const getPlayersMMDStats = async (
  gameID: number,
  playersPID: number[]
) => {
  const pidToString = `"${playersPID.join('","')}"`;
  const query = `select 
                  pid, 
                  group_concat(varname),
                  group_concat(value_int) as dks,
                  round(group_concat(value_real)) as damage,
                  group_concat(value_string) as heroes
                from w3mmdvars
                  where gameid = ${gameID} and pid in (${pidToString})
                group by pid`;
  const result = await makeQuery(query);

  if (!result) return null;

  return result.map((player: any) => {
    const [deaths, kills, score] = player.dks.split(",");
    return {
      pid: player.pid,
      kills: Number(kills),
      deaths: Number(deaths),
      score: Number(score),
      damage: player.damage,
      heroes: player.heroes,
    };
  });
};
