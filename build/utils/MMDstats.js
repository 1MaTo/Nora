"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderBordByDamage = exports.getWinStats = exports.getParsedGamesStats = void 0;
const queries_1 = require("../db/queries");
const getParsedGamesStats = (nickname = null) => __awaiter(void 0, void 0, void 0, function* () {
    const games = new Map();
    let gameIds = null;
    if (nickname) {
        gameIds = yield (0, queries_1.getGamesIdByPlayerNickname)(nickname);
    }
    else {
        gameIds = yield (0, queries_1.getFinishedGamesId)();
    }
    if (!gameIds || gameIds.length === 0)
        return null;
    const groupedGames = yield (0, queries_1.getGroupedGamesByGameid)(gameIds);
    for (let index = 0; index < groupedGames.length; index++) {
        const team = groupedGames[index];
        const currGame = games.get(team.gameid);
        const pidToNickname = team.colours.reduce((prev, colour, index) => {
            prev[colour] = team.nicknames[index];
            return prev;
        }, {});
        const teamMMDstats = yield (0, queries_1.getPlayersMMDStats)(team.gameid, team.colours);
        if (!currGame) {
            games.set(team.gameid, {
                gameid: team.gameid,
                duration: team.duration,
                gameScore: { [team.flag]: teamMMDstats[0].score },
                players: team.nicknames.map((nick) => {
                    const player = teamMMDstats.find((player) => {
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
        currGame.players.push(...team.nicknames.map((nick) => {
            const player = teamMMDstats.find((player) => {
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
        }));
        games.set(team.gameid, currGame);
    }
    return [...games]
        .map(([_, game]) => game)
        .filter((game) => game.gameScore.winner !== undefined &&
        game.gameScore.loser !== undefined);
});
exports.getParsedGamesStats = getParsedGamesStats;
const getWinStats = (nickname) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield (0, exports.getParsedGamesStats)(nickname);
    if (!games)
        return null;
    const winrates = games.reduce((prev, game) => {
        game.players.forEach((player) => {
            const isTargetPlayer = player.nickname === nickname;
            // TARGET PLAYER STATS
            if (isTargetPlayer) {
                if (!prev.player["win"])
                    prev.player["win"] = 0;
                if (!prev.player["lose"])
                    prev.player["lose"] = 0;
                prev.player["win"] += player.winner ? 1 : 0;
                prev.player["lose"] += player.winner ? 0 : 1;
                prev.player["percent"] = Math.round((prev.player["win"] / (prev.player["win"] + prev.player["lose"])) *
                    100);
                return;
            }
            const playerType = game.players.find((player) => player.nickname === nickname).winner ===
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
            prev[playerType][player.nickname]["percent"] = Math.round((prev[playerType][player.nickname]["win"] /
                (prev[playerType][player.nickname]["win"] +
                    prev[playerType][player.nickname]["lose"])) *
                100);
        });
        return prev;
    }, {
        player: { nickname: nickname },
        teammates: {},
        enemies: {},
    });
    return {
        player: winrates.player,
        teammates: Object.values(winrates.teammates),
        enemies: Object.values(winrates.enemies),
    };
});
exports.getWinStats = getWinStats;
const getLeaderBordByDamage = (threshold = 3) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield (0, exports.getParsedGamesStats)();
    if (!games)
        return null;
    const damageStats = games.reduce((prev, game) => {
        // Only 2x2 and 3x3 games
        if (game.players.length > 6 || game.players.length < 4)
            return prev;
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
                };
            }
            // Old player
            prev.players[player.nickname]["totalDmg"] += player.totalDamage;
            prev.players[player.nickname]["games"] += 1;
            prev.players[player.nickname]["rounds"] += rounds;
            prev.players[player.nickname]["dpr"] = Math.round(prev.players[player.nickname]["totalDmg"] /
                (prev.players[player.nickname]["rounds"] || 1));
        });
        return prev;
    }, {
        players: [],
        threshold: 0,
        totalDamage: 0,
        totalGames: 0,
    });
    damageStats.threshold = Math.floor(damageStats.totalGames * (threshold / 100));
    damageStats.players = Object.values(damageStats.players)
        .filter((player) => player.games >= damageStats.threshold)
        .sort((a, b) => b.dpr - a.dpr);
    if (!damageStats.players || damageStats.players.length === 0)
        return null;
    return damageStats;
});
exports.getLeaderBordByDamage = getLeaderBordByDamage;
