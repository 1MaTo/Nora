import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";

export const unbindNickname = async (userID: string, guildID: string) => {
  const key = redisKey.struct(groupsKey.bindNickname, [guildID, userID]);
  await redis.del(key);
  return true;
};
