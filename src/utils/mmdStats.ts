import {
  getFinishedGamesId,
  getGamesIdByPlayerNickname,
  getGroupedGamesByGameid,
  getPlayersMMDStats,
} from "../db/queries";
import { log } from "./log";

export const getParsedGamesStats = async (nickname: string = null) => {
  const games = new Map();
  let gameIds = null;

  if (nickname) {
    gameIds = await getGamesIdByPlayerNickname(nickname);
  } else {
    gameIds = await getFinishedGamesId();
  }

  if (!gameIds || gameIds.length === 0) return null;

  const groupedGames = await getGroupedGamesByGameid(gameIds);

  for (let index = 0; index < groupedGames.length; index++) {
    const team = groupedGames[index];
    const currGame = games.get(team.gameid);
    const pidToNickname = team.colours.reduce(
      (prev: any, colour: any, index: any) => {
        prev[colour] = team.nicknames[index];
        return prev;
      },
      {}
    );

    const teamMMDstats = await getPlayersMMDStats(team.gameid, team.colours);
    if (!currGame) {
      games.set(team.gameid, {
        gameid: team.gameid,
        duration: team.duration,
        gameScore: { [team.flag]: teamMMDstats[0].score },
        players: team.nicknames.map((nick: string) => {
          const player = teamMMDstats.find((player: any) => {
            return pidToNickname[player.pid] === nick;
          });
          return {
            nickname: nick,
            winner: team.flag === "winner",
            pid: player.pid,
            totalDamage: player.damage,
            kills: player.kills,
            deaths: player.deaths,
            heroes: player.heroes,
          };
        }),
      });
      continue;
    }
    currGame.gameScore[team.flag] = teamMMDstats[0].score;
    currGame.players.push(
      ...team.nicknames.map((nick: string) => {
        const player = teamMMDstats.find((player: any) => {
          return pidToNickname[player.pid] === nick;
        });
        return {
          nickname: nick,
          winner: team.flag === "winner",
          pid: player.pid,
          totalDamage: player.damage,
          kills: player.kills,
          deaths: player.deaths,
          heroes: player.heroes,
        };
      })
    );
    games.set(team.gameid, currGame);
  }

  return [...games]
    .map(([_, game]) => game)
    .filter(
      (game) =>
        game.gameScore.winner !== undefined &&
        game.gameScore.loser !== undefined
    ) as fullGameInfo[];
};

export const getWinStats = async (nickname: string) => {
  const games = await getParsedGamesStats(nickname);

  if (!games) return null;

  const winrates = games.reduce(
    (prev, game) => {
      game.players.forEach((player) => {
        const isTargetPlayer = player.nickname === nickname;

        // TARGET PLAYER STATS
        if (isTargetPlayer) {
          if (!prev.player["win"]) prev.player["win"] = 0;
          if (!prev.player["lose"]) prev.player["lose"] = 0;

          prev.player["win"] += player.winner ? 1 : 0;
          prev.player["lose"] += player.winner ? 0 : 1;
          prev.player["percent"] = Math.round(
            (prev.player["win"] / (prev.player["win"] + prev.player["lose"])) *
              100
          );
          return;
        }

        const playerType =
          game.players.find((player) => player.nickname === nickname).winner ===
          player.winner
            ? "teammates"
            : "enemies";

        // TEAMMATES STATS
        if (!prev[playerType][player.nickname]) {
          prev[playerType][player.nickname] = {
            nickname: player.nickname,
            win: 0,
            lose: 0,
            percent: 0,
          };
        }

        prev[playerType][player.nickname]["win"] += player.winner ? 1 : 0;
        prev[playerType][player.nickname]["lose"] += player.winner ? 0 : 1;
        prev[playerType][player.nickname]["percent"] = Math.round(
          (prev[playerType][player.nickname]["win"] /
            (prev[playerType][player.nickname]["win"] +
              prev[playerType][player.nickname]["lose"])) *
            100
        );
      });
      return prev;
    },
    {
      player: { nickname: nickname },
      teammates: {},
      enemies: {},
    }
  );

  return {
    player: winrates.player,
    teammates: Object.values(winrates.teammates),
    enemies: Object.values(winrates.enemies),
  } as playerWinStats;
};

export const getLeaderBordByDamage = async (threshold: number = 3) => {
  const games = await getParsedGamesStats();

  if (!games) return null;

  const damageStats = games.reduce(
    (prev, game) => {
      // Only 2x2 and 3x3 games
      if (game.players.length > 6 || game.players.length < 4) return prev;

      prev.totalGames += 1;
      game.players.forEach((player) => {
        const rounds = game.gameScore[player.winner ? "winner" : "loser"];
        prev.totalDamage += player.totalDamage;

        // New player
        if (!prev.players[player.nickname]) {
          prev.players[player.nickname] = {
            dpr: 0,
            games: 0,
            nickname: player.nickname,
            rounds: 0,
            totalDmg: 0,
          } as damageStatsPlayerInfo;
        }

        // Old player
        prev.players[player.nickname]["totalDmg"] += player.totalDamage;
        prev.players[player.nickname]["games"] += 1;
        prev.players[player.nickname]["rounds"] += rounds;
        prev.players[player.nickname]["dpr"] = Math.round(
          prev.players[player.nickname]["totalDmg"] /
            (prev.players[player.nickname]["rounds"] || 1)
        );
      });

      return prev;
    },
    {
      players: [],
      threshold: 0,
      totalDamage: 0,
      totalGames: 0,
    } as damageStatsInfo
  );

  damageStats.threshold = Math.floor(
    damageStats.totalGames * (threshold / 100)
  );

  damageStats.players = Object.values(damageStats.players)
    .filter((player) => player.games >= damageStats.threshold)
    .sort((a, b) => b.dpr - a.dpr);

  if (!damageStats.players || damageStats.players.length === 0) return null;

  return damageStats;
};
