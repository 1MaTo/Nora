import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";

export const getCommandLogs = async (
  guildId: string,
  query: string
): Promise<string[]> => {
  const key = redisKey.struct(groupsKey.commandLog, [guildId]);

  const logs = ((await redis.get(key)) as string[]) || [];

  if (query) {
    return logs.filter((log: string) => new RegExp(query, "i").test(log));
  }

  return logs;
};
