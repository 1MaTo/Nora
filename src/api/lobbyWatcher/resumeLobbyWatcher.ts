import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";

export const resumeLobbyWatcher = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  if (!settings) return;

  settings.paused = false;

  await redis.set(key, { ...settings });
};
