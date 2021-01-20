import { dbErrors } from "../strings/logsMessages";
import { fbtSettings } from "../../config.json";
import { logError, autodeleteMsg, guildRedisKey } from "../utils";
import { redis } from "../redis/redis";
import { objectKey } from "../redis/objects";
import { lobbyWatcher } from "../bot";

export const name = "test";
export const args = 0;
export const aliases = ["t", "te"];
export const usage = "<one> <two>";
export const description = "Just test command";
export const guildOnly = true;
export const development = true;
export const adminOnly = false;
export const caseSensitive = true;
export const run = async (message, args) => {
    console.log("test gs", await redis.get(guildRedisKey.struct(objectKey.gameStats, "556150178147467265")));
    console.log("test lw", await redis.get(guildRedisKey.struct(objectKey.lobbyWatcher, "556150178147467265")));
    console.log("prod gs", await redis.get(guildRedisKey.struct(objectKey.gameStats, "408947483763277825")));
    console.log("prod lw", await redis.get(guildRedisKey.struct(objectKey.lobbyWatcher, "408947483763277825")));
};
