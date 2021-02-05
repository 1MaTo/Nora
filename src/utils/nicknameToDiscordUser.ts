import { groupsKey, keyDivider, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { log } from "./log";

export const getDiscordUserFromNicknames = async (
  nicknames: string[],
  guildID: string
) => {
  const allNicks = (
    await redis.scanForPattern(
      `${groupsKey.bindNickname}${keyDivider}${guildID}*`
    )
  ).map((key) => redisKey.destruct(key)[1]);
  log(allNicks);
};
