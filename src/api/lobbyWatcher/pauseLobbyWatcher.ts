import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { resumeLobbyWatcher } from "./resumeLobbyWatcher";

export const pauseLobbyWatcher = async (guildID: string, delay?: number) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  if (!settings) return;

  settings.paused = true;
  await redis.set(key, { ...settings });

  if (delay) return setTimeout(() => resumeLobbyWatcher(guildID), delay);
  return null;
};
