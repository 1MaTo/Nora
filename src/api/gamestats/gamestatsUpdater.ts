import { getFinishedGamesId } from "../../db/queries";
import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { collectGamesData } from "../../utils/gamestatsUtils";

export const gamestatsUpdater = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.gameStats, [guildID]);
  const settings = (await redis.get(key)) as gamestatsInfo;

  if (!settings) return;

  const ids = await getFinishedGamesId();

  if (!ids)
    return setTimeout(() => gamestatsUpdater(settings.guildID), settings.delay);

  if (!settings.prevGamesCount) {
    settings.prevGamesCount = ids.length;
    await redis.set(key, settings);
  }

  if (ids.length - settings.prevGamesCount < 0) {
    settings.prevGamesCount = ids.length;
    await redis.set(key, settings);
  }

  const newGamesCount = ids.length - settings.prevGamesCount;

  if (newGamesCount > 0) {
    settings.prevGamesCount = ids.length;
    await redis.set(key, settings);
    const idToPoll = ids.splice(-newGamesCount);
    collectGamesData(idToPoll, settings.channelID, settings.guildID);
  }
  setTimeout(() => gamestatsUpdater(settings.guildID), settings.delay);
};
