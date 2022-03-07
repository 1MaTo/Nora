import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";

export const stopGamestats = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.gameStats, [guildID]);
  await redis.del(key);
  return;
};
