import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";

export const isRunning = async (
  guildID: string
): Promise<gamestatsInfo | null> => {
  const key = redisKey.struct(groupsKey.gameStats, [guildID]);
  const result = await redis.get(key);
  return result;
};
