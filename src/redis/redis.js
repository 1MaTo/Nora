import { createClient } from "redis";
import { promisify } from "util";
import { redisConnection } from "../../auth.json";

const client = createClient(redisConnection);

client.on("error", function (error) {
    console.error("REDIS ERROR: ", error);
});

const getObj = promisify(client.get).bind(client);
const setObj = promisify(client.set).bind(client);
const mgetObj = promisify(client.mget).bind(client);

export const redis = {
    get: async key => JSON.parse(await getObj(key)),
    set: async (key, data) => await setObj(key, JSON.stringify(data)),
    mget: async kies => (await mgetObj(kies)).map(object => JSON.parse(object)),
    del: promisify(client.del).bind(client),
    exist: promisify(client.exists).bind(client),
};
