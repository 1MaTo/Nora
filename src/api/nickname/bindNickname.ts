import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { defaultUserData } from "../../utils/globals";

export const bindNickname = async (
  nickname: string,
  userID: string,
  guildID: string
) => {
  const key = redisKey.struct(groupsKey.bindNickname, [guildID, userID]);
  await redis.set(key, {
    nickname,
    discordID: userID,
    settings: defaultUserData,
  } as userData);
  return true;
};
