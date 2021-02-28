import {
  getGamesIdByPlayerNickname,
  getGroupedGamesByGameid,
  getPlayersMMDStats,
} from "../db/queries";

export const getParsedGamesStatsByNickname = async (nickname: string) => {
  const games = new Map();

  const gameIds = await getGamesIdByPlayerNickname(nickname);

  if (!gameIds) return null;

  const groupedGames = await getGroupedGamesByGameid(gameIds);

  for (let index = 0; index < groupedGames.length; index++) {
    const team = groupedGames[index];
    const currGame = games.get(team.gameid);
    const teamMMDstats = await getPlayersMMDStats(team.gameid, team.colours);
    if (!currGame) {
      games.set(team.gameid, {
        gameid: team.gameid,
        duration: team.duration,
        gameScore: { [team.flag]: teamMMDstats[0].score },
        players: team.nicknames.map((nick: string, index: number) => {
          const player = teamMMDstats[index];
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
      ...team.nicknames.map((nick: string, index: number) => {
        const player = teamMMDstats[index];
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

  return [...games].map(([_, game]) => game) as fullGameInfo[];
};

export const getWinStats = async (nickname: string) => {
  const games = await getParsedGamesStatsByNickname(nickname);

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
