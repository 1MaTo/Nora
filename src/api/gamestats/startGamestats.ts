import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { log } from "../../utils/log";
import { gamestatsUpdater } from "./gamestatsUpdater";

export const startGamestats = async (
  guildID: string,
  channelID: string,
  delay: number
) => {
  try {
    const key = redisKey.struct(groupsKey.gameStats, [guildID]);

    const settings = {
      guildID: guildID,
      channelID: channelID,
      delay: delay,
    } as gamestatsInfo;

    await redis.set(key, settings);
    setTimeout(() => gamestatsUpdater(settings.guildID), delay);
    return true;
  } catch (error) {
    log(error);
    return false;
  }
};
