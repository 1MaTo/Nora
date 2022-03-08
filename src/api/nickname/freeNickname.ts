import { getNicknames } from "../../db/queries";
import { groupsKey, keyDivider, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";

export const freeNickname = async (nickname: string, guildID: string) => {
  const nicks = await getNicknames();

  if (!nicks) return null;

  const exist = nicks.some((nick: string) => nick === nickname);

  if (!exist) return null;

  const bindedNicknames = await redis.scanForPattern(
    `${groupsKey.bindNickname}${keyDivider}${guildID}*`
  );

  if (!bindedNicknames) return true;

  const redisNicknames = await Promise.all(
    bindedNicknames.map(async (key) => (await redis.get(key)) as userData)
  );

  const index = redisNicknames.findIndex((user) => {
    return user.nickname === nickname;
  });

  if (index !== -1) return redisKey.destruct(bindedNicknames[index])[1];

  return true;
};
