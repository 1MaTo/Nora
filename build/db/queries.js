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
exports.createLobbyGame = exports.clearLobbyGame = exports.getPlayersMMDStats = exports.checkPlayerWin = exports.getGroupedGamesByGameid = exports.getGamesIdByPlayerNickname = exports.getWinnerTeamNumberFromId = exports.saveMapStats = exports.getGamesDataByIds = exports.getPlayersByGameId = exports.getFinishedGamesId = exports.getGamesCountInfo = exports.getNicknames = exports.getStatsGameCount = exports.getPlayerWinrateForLobbyWatcher = exports.getLobbyList = void 0;
const globals_1 = require("../utils/globals");
const lobbyParser_1 = require("../utils/lobbyParser");
const log_1 = require("../utils/log");
const mapConfig_1 = require("../utils/mapConfig");
const uniqueFromArray_1 = require("../utils/uniqueFromArray");
const mysql_1 = require("./mysql");
const getLobbyList = (botid) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * from gamelist`;
    const result = yield (0, mysql_1.makeQuery)(query);
    if (!result)
        return null;
    const lobbyList = result.filter((game) => (game.gamename !== "" ||
        game.ownername !== "" ||
        game.creatorname !== "") &&
        (botid ? botid === game.botid : true));
    return lobbyList;
});
exports.getLobbyList = getLobbyList;
const getPlayerWinrateForLobbyWatcher = (nickname) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield (0, mysql_1.makeQuery)(query);
    if (!result || !result.length)
        return null;
    const parsed = result.map((obj) => obj.flag);
    const stats = parsed.reduce((stat, result) => {
        if (result === "loser") {
            stat.lose++;
        }
        else {
            stat.win++;
        }
        if (stat.streak.type === result) {
            stat.streak.count++;
        }
        else {
            stat.streak.type = result;
            stat.streak.count = 1;
        }
        return stat;
    }, { win: 0, lose: 0, streak: { type: "winner", count: 0 } });
    return `${Math.round((stats.win / (stats.win + stats.lose)) * 100)}% | ${stats.win + stats.lose} | ${stats.streak.count} ${stats.streak.type == "winner"
        ? "<:winstreak:812779155334365184>"
        : "<:losestreak:812779155418644521>"}`;
});
exports.getPlayerWinrateForLobbyWatcher = getPlayerWinrateForLobbyWatcher;
const getStatsGameCount = (nickname, mapName) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    select count(*) as count
    from gameplayers
    inner join games on games.id = gameplayers.gameid
    inner join mapstats on mapstats.gameid = games.id
    where gameplayers.name in ("${nickname}") and map like '%${mapName}%';`;
    const result = yield (0, mysql_1.makeQuery)(query);
    return result ? result.count : 0;
});
exports.getStatsGameCount = getStatsGameCount;
const getNicknames = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT DISTINCT name FROM gameplayers where name != " " order by name;`;
    const result = yield (0, mysql_1.makeQuery)(query);
    return result && result.length > 0
        ? result.map((item) => item.name)
        : null;
});
exports.getNicknames = getNicknames;
const getGamesCountInfo = (nickname, minIngameTime = 900) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield (0, mysql_1.makeQuery)(query);
    return (result &&
        result.map((game) => {
            return Object.assign(Object.assign({}, game), { gamesID: game.gamesId.split(","), teams: game.teams.split(","), map: (0, lobbyParser_1.parseMapName)(game.map) });
        }));
});
exports.getGamesCountInfo = getGamesCountInfo;
const getFinishedGamesId = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT gameid as id from w3mmdplayers 
                inner join games on games.id = w3mmdplayers.gameid
                where flag in ("loser", "winner") group by gameid`;
    const result = yield (0, mysql_1.makeQuery)(query);
    return result ? result.map((game) => game.id) : null;
});
exports.getFinishedGamesId = getFinishedGamesId;
const getPlayersByGameId = (gamesID) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT 
        gameplayers.gameid,
        gameplayers.name, 
        gameplayers.team 
    FROM ghost.gameplayers
    where gameplayers.gameid in (${gamesID.join(",")}) 
    order by gameid, team`;
    const players = yield (0, mysql_1.makeQuery)(query);
    return players;
});
exports.getPlayersByGameId = getPlayersByGameId;
const getGamesDataByIds = (gamesID, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const players = yield (0, exports.getPlayersByGameId)(gamesID);
        const query = `
    SELECT 
        id, 
        map, 
        datetime, 
        gamename, 
        duration 
    FROM games where id in (${gamesID.join(",")})`;
        const gamesData = yield (0, mysql_1.makeQuery)(query);
        if (!gamesData.length || !players)
            return null;
        const parsedGamesData = yield Promise.all(gamesData.map((game) => __awaiter(void 0, void 0, void 0, function* () {
            const gamePlayers = players.filter((player) => player.gameid === game.id);
            const teams = (0, uniqueFromArray_1.uniqueFromArray)(gamePlayers.map((player) => player.team));
            const parsedTeams = [];
            const mapConfig = yield (0, mapConfig_1.searchMapConfigByMapName)(game.map, guildID);
            if (mapConfig)
                teams.forEach((team) => mapConfig.slotMap[team] &&
                    mapConfig.slotMap[team].name.toLowerCase() !== "spectators"
                    ? parsedTeams.push(mapConfig.slotMap[team].name)
                    : null);
            else
                teams.forEach((team) => parsedTeams.push(`Team ${team + 1}`));
            return {
                id: game.id,
                map: (0, lobbyParser_1.parseMapName)(game.map),
                datetime: new Date(game.datetime),
                gamename: game.gamename.replace(/#\d+/g, "").trim(),
                duration: game.duration,
                winnerTeam: yield (0, exports.getWinnerTeamNumberFromId)(game.id),
                players: parsedTeams.map((teamName, index) => {
                    const teamPlayers = gamePlayers.filter((player) => player.team === index);
                    return { teamName, teamPlayers };
                }),
            };
        })));
        if (!parsedGamesData)
            return null;
        return parsedGamesData;
    }
    catch (error) {
        (0, log_1.log)(error);
        return null;
    }
});
exports.getGamesDataByIds = getGamesDataByIds;
const saveMapStats = (gameID, winTeam) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO mapstats (gameid, winteam) VALUES(${gameID}, ${winTeam})`;
    try {
        const result = yield (0, mysql_1.makeQuery)(query);
        return true;
    }
    catch (error) {
        (0, log_1.log)(error);
        return null;
    }
});
exports.saveMapStats = saveMapStats;
const getWinnerTeamNumberFromId = (gameID) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT team from w3mmdplayers 
                inner join gameplayers on 
                  gameplayers.colour = w3mmdplayers.pid and 
                  gameplayers.gameid = w3mmdplayers.gameid
                where gameplayers.gameid=${gameID} and flag = "winner" group by team`;
    const result = yield (0, mysql_1.makeQuery)(query);
    return result && result[0].team;
});
exports.getWinnerTeamNumberFromId = getWinnerTeamNumberFromId;
// ********************* GAME STATISTIC QUERIES *********************
const getGamesIdByPlayerNickname = (nickname) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT w3mmdplayers.gameid
                FROM gameplayers
                left join w3mmdplayers on
                  w3mmdplayers.gameid = gameplayers.gameid 
                  and w3mmdplayers.pid = gameplayers.colour
                where gameplayers.name = "${nickname}" 
                  and gameplayers.team < 2
                  and w3mmdplayers.id`;
    const result = yield (0, mysql_1.makeQuery)(query);
    return result && result.map((game) => game.gameid);
});
exports.getGamesIdByPlayerNickname = getGamesIdByPlayerNickname;
const getGroupedGamesByGameid = (games) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield (0, mysql_1.makeQuery)(query);
    if (!result)
        return null;
    const parsedResult = result.map((game) => {
        return Object.assign(Object.assign({}, game), { nicknames: game.nicknames.split(","), team: Number(game.team.split(",")[0]), colours: JSON.parse(`[${game.colours}]`), flag: game.flag.split(",")[0] });
    });
    return parsedResult;
});
exports.getGroupedGamesByGameid = getGroupedGamesByGameid;
const checkPlayerWin = (gameID, pid) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `select flag from w3mmdplayers where gameid = ${gameID} and pid = ${pid}`;
    const result = yield (0, mysql_1.makeQuery)(query);
    if (!result)
        return null;
    return result === "winner";
});
exports.checkPlayerWin = checkPlayerWin;
const getPlayersMMDStats = (gameID, playersPID) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield (0, mysql_1.makeQuery)(query);
    if (!result)
        return null;
    return result.map((player) => {
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
});
exports.getPlayersMMDStats = getPlayersMMDStats;
const clearLobbyGame = (botid) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE gamelist
                SET
                  gamename = "",
                  ownername = "",
                  creatorname ="",
                  map = "",
                  slotstaken = ${0},
                  slotstotal = ${0},
                  usernames = "",
                  totalgames = ${0},
                  totalplayers = ${0}
                WHERE botid = ${botid};`;
    yield (0, mysql_1.makeQuery)(query);
});
exports.clearLobbyGame = clearLobbyGame;
const createLobbyGame = (botid, mapName) => __awaiter(void 0, void 0, void 0, function* () {
    const fullMapName = mapName ? mapName + ".w3x" : "Creating game...";
    const query = `UPDATE gamelist
                SET
                  gamename = "${globals_1.production ? "res publica game" : "test"}",
                  ownername = "replica",
                  creatorname ="replica",
                  map = "${fullMapName || "Creating game..."}",
                  slotstaken = ${0},
                  slotstotal = ${1},
                  usernames = "",
                  totalgames = ${1},
                  totalplayers = ${0}
                WHERE botid = ${botid};`;
    yield (0, mysql_1.makeQuery)(query);
});
exports.createLobbyGame = createLobbyGame;
