import mysql from "mysql";
import util from "util";
import { dbConnection } from "../../auth.json";
import { logError, uniqueFromArray } from "../utils";
import { parseGameListResults, parseMapName } from "./utils";
import { defaultFbtOptionalConfig } from "../strings/constants";

export const db = mysql.createConnection(dbConnection);

db.connect();

export const asyncDb = {
    query(sql, args) {
        return util.promisify(db.query).call(db, sql, args);
    },
};

export const getLobby = (guildId, callback) => {
    db.query("SELECT * from gamelist", (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
        if (!results.length) return callback(null, "Empty query");
        callback(parseGameListResults(guildId, results));
    });
};

export const getLobbyPlayersCount = (gameid, callback) => {
    db.query(
        `SELECT usernames, gamename, map, slotstaken, slotstotal FROM ghost.gamelist where id=${gameid} and gamename!="" and ownername!="" and creatorname!="" and map!="" and slotstotal!=0;`,
        (error, results) => {
            if (error) {
                console.error(error);
                return callback(null, error.message);
            }
            if (!results.length) return callback(null, "Empty query");
            callback(results[0]);
        }
    );
};

export const getMapNames = (guildId, callback) => {
    db.query(`SELECT map from mapconfigs where guildid = ${guildId}`, (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
        if (!results.length) return callback(null, "Empty query");
        callback(results.map(item => item.map));
    });
};

export const getMapConfig = (guildId, map, callback) => {
    db.query(`SELECT config from mapconfigs where guildid = ${guildId} and map = "${map}"`, (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
        if (!results.length || results[0].config === null) return callback(null, "Empty query");
        callback({ options: defaultFbtOptionalConfig, ...JSON.parse(results[0].config) });
    });
};

export const deleteMapConfig = (guildId, map, callback) => {
    db.query(`DELETE FROM mapconfigs WHERE guildid=${guildId} and map="${map}"`, (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
        if (!results.affectedRows) return callback(null, "Empty query");
        callback(results);
    });
};

export const updateMapConfig = (guildId, map, config, callback) => {
    db.query(
        `replace into mapconfigs (guildid, map, config) values (${guildId}, "${map}", '${config}')`,
        (error, results) => {
            if (error) {
                console.error(error);
                return callback(null, error.message);
            }
            callback(results);
        }
    );
};

export const searchMapConfigOrDefault = async (guildId, game) => {
    const mapName = parseMapName(game.map);
    const defaultMapConfig = {
        mapName: mapName,
        options: defaultFbtOptionalConfig,
        slots: game.slotstotal,
        slotMap: [{ slots: game.slotstotal, name: "Lobby" }],
    };
    try {
        const mapConfigList = await asyncDb.query(`SELECT config FROM mapconfigs where guildid="${guildId}"`);
        if (!mapConfigList.length) return { ...defaultMapConfig };
        const mapConfig = mapConfigList.find(map =>
            mapName.toLowerCase().match(new RegExp(JSON.parse(map.config).name.toLowerCase(), "gi"))
        );
        if (!mapConfig) return { ...defaultMapConfig };
        return {
            ...defaultMapConfig,
            ...JSON.parse(mapConfig.config),
        };
    } catch (error) {
        console.log(error);
        return {
            ...defaultMapConfig,
        };
    }
};

export const searchMapConfig = async (guildId, mapName) => {
    try {
        const mapConfigList = await asyncDb.query(`SELECT config from mapconfigs where guildid = ${guildId}`);
        if (!mapConfigList.length || mapConfigList[0].config === null) return null;
        const mapConfig = mapConfigList.find(map =>
            mapName.toLowerCase().match(new RegExp(JSON.parse(map.config).name.toLowerCase(), "gi"))
        );
        if (!mapConfig) return null;
        return JSON.parse(mapConfig.config);
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getFinishedGamesCount = async () => {
    try {
        const gamesCount = await asyncDb.query(`SELECT COUNT(id) as count from games`);
        return gamesCount[0].count;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getFinishedGamesId = async () => {
    try {
        const games = await asyncDb.query(`SELECT id from games`);
        return games.map(game => game.id);
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getPlayersByGameId = async gamesId => {
    try {
        const players = await asyncDb.query(`
        SELECT 
            gameplayers.gameid,
            gameplayers.name, 
            gameplayers.team 
        FROM ghost.gameplayers
        where gameplayers.gameid in (${gamesId.join(",")}) 
        order by gameid, team`);
        if (!players.length) return null;
        return players;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getGamesDataByIds = async (gamesId, guildId) => {
    try {
        const players = await getPlayersByGameId(gamesId);
        const gamesData = await asyncDb.query(`
        SELECT 
            id, 
            map, 
            datetime, 
            gamename, 
            duration 
        FROM games where id in (${gamesId.join(",")})`);
        if (!gamesData.length || !players) return null;
        const parsedGamesData = await Promise.all(
            gamesData.map(async game => {
                const gamePlayers = players.filter(player => player.gameid === game.id);
                const teams = uniqueFromArray(gamePlayers.map(player => player.team));
                const parsedTeams = [];
                const mapConfig = await searchMapConfig(guildId, parseMapName(game.map));

                if (mapConfig)
                    teams.forEach(team =>
                        mapConfig.slotMap[team] && mapConfig.slotMap[team].name.toLowerCase() !== "spectators"
                            ? parsedTeams.push(mapConfig.slotMap[team].name)
                            : null
                    );
                else teams.forEach(team => parsedTeams.push(`Team ${team + 1}`));

                return {
                    id: game.id,
                    map: parseMapName(game.map),
                    datetime: new Date(game.datetime),
                    gamename: game.gamename.replaceAll(/#\d+/g, "").trim(),
                    duration: Number(game.duration),
                    players: parsedTeams.map((teamName, index) => {
                        const teamPlayers = gamePlayers.filter(player => player.team === index);
                        return { teamName, teamPlayers };
                    }),
                };
            })
        );
        if (!parsedGamesData) return null;
        return parsedGamesData;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getPlayersNicknames = async () => {
    try {
        const result = await asyncDb.query(`SELECT DISTINCT name FROM gameplayers where name != " " order by name;`);
        return result.map(item => item.name);
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const saveMapStats = async (gameid, winTeam) => {
    try {
        const result = await asyncDb.query(`INSERT INTO mapstats (gameid, winteam) VALUES(${gameid}, ${winTeam})`);
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
};
