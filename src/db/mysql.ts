import mysql from "mysql";
import util from "util";
import { dbConnection } from "../auth.json";
import { log } from "../utils/log";

const db = mysql.createConnection(dbConnection);

const connectToDb = () => {
  try {
    db.connect();
  } catch (error) {
    log(error);
    setTimeout(() => connectToDb(), 5000);
  }
};

connectToDb();

db.on("error", (error) => {
  log(error);
  connectToDb();
});

export const dbQuery = (sql: string) => {
  return util.promisify(db.query).call(db, sql);
};

export const makeQuery = async (query: string) => {
  try {
    const result = await dbQuery(query);
    if (!result.length) return null;
  } catch (error) {
    log(error);
    return null;
  }
};
