import { createClient } from "redis";
import { promisify } from "util";
import { redisConnection } from "../auth.json";
import { log } from "../utils/log";

const client = createClient(redisConnection);

client.on("error", (error) => {
  log(error);
});

const getObj = promisify(client.get).bind(client);
const setObj = promisify(client.set).bind(client);
const mgetObj = promisify(client.mget).bind(client);

export const redis = {
  get: async (key: string) => JSON.parse(await getObj(key)),
  set: async (key: string, data: any) =>
    await setObj(key, JSON.stringify(data)),
  mget: async (kies: string) =>
    (await mgetObj(kies)).map((object: any) => JSON.parse(object)),
  del: promisify(client.del).bind(client),
  exist: promisify(client.exists).bind(client),
};
