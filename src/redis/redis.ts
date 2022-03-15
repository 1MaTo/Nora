import { createClient } from "redis";
import { promisify } from "util";
import { redisConnection } from "../auth.json";
import { log } from "../utils/log";

const client = createClient(redisConnection);

client.on("error", (error) => {
  log(error);
});

client.on("reconnecting", () => {});

const getObj = promisify(client.get).bind(client);
const setObj = promisify(client.set).bind(client);
const mgetObj = promisify(client.mget).bind(client);
const scan = promisify(client.scan).bind(client);

export const redis = {
  get: async (key: string) => {
    try {
      return JSON.parse(await getObj(key));
    } catch (error) {
      log("[redis] cant get item");
      return undefined;
    }
  },
  set: async (key: string, data: any) => {
    try {
      return await setObj(key, JSON.stringify(data));
    } catch (error) {
      log("[redis] cant set item");
      return undefined;
    }
  },
  mget: async (kies: string) =>
    (await mgetObj(kies)).map((object: any) => JSON.parse(object)),
  del: promisify(client.del).bind(client),
  exist: promisify(client.exists).bind(client),
  scanForPattern: async (pattern: string): Promise<Array<string> | null> => {
    let cursor = "0";
    const found = [];
    do {
      const reply = await scan(cursor, "MATCH", pattern);

      cursor = reply[0];
      found.push(...reply[1]);
    } while (cursor !== "0");

    return found.length ? found : null;
  },
};
