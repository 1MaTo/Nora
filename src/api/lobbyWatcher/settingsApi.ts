import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";

export const updateLobbyWatcherSettings = async (
  guildID: string,
  data: lobbyWatcherUpdateInfo
) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;
  const result = await redis.set(key, { ...settings, ...data });

  if (!result) return null;

  return result;
};

export const getLobbyWatcherSettings = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  return settings;
};

export const deleteLobbyWatcherSettings = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const result = await redis.del(key);

  if (!result) return null;

  return result;
};
