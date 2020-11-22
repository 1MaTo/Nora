import mysql from "mysql";
import { dbConnection } from "../../auth.json";
import { parseGameListResults } from "./utils";

export const db = mysql.createConnection(dbConnection);

db.connect();

export const getLobby = (callback) => {
    db.query("SELECT * from gamelist", (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
        if (!results.length) return callback(null, "Empty query");
        callback(parseGameListResults(results));
    });
};

export const getConfigs = () => {
    
}

const testDB = () => {
    db.query("SELECT * from gamelist", (error, results) => {
        if (error) {
            console.error(error);
            return callback(null, error.message);
        }
    });
};
//testDB();
