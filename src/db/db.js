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

export const getConfigs = () => {};
