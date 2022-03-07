import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";

export const isRunning = async (
  guildID: string
): Promise<lobbyWatcherInfo | null> => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const result = await redis.get(key);
  return result;
};
