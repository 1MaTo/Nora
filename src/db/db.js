import mysql from "mysql";
import { dbConnection } from "../../auth.json";
import { logError } from "../utils";
import { parseGameListResults } from "./utils";

export const db = mysql.createConnection(dbConnection);

db.connect();

export const getLobby = callback => {
    db.query("SELECT * from gamelist", (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
        if (!results.length) return callback(null, "Empty query");
        callback(parseGameListResults(results));
    });
};

export const getLobbyPlayersCount = (gameid, callback) => {
    db.query(
        `SELECT gamename, map, slotstaken, slotstotal FROM ghost.gamelist where id=${gameid} and gamename!="" and ownername!="" and creatorname!="" and map!="" and slotstotal!=0;`,
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

        callback(JSON.parse(results[0].config));
    });
};

export const deleteMapConfig = (guildId, map, callback) => {
    db.query(`DELETE FROM mapconfigs WHERE guildid=${guildId} and map=${map}`, (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
        //if (!results.length) return callback(null, "Empty query");
        callback(results);
    });
};

export const updateMapConfig = (guildId, map, config, callback) => {
    db.query(`replace into mapconfigs (guildid, map, config) values (${guildId}, ${map}, ${config})`, (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
        //if (!results.length) return callback(null, "Empty query");
        callback(results);
    });
};

export const getConfigs = () => {};
