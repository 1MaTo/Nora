import { groupsKey, keyDivider } from "../redis/kies";
import { redis } from "../redis/redis";

export const getDiscordUsersFromNicknames = async (
  nicknames: string[],
  guildID: string
) => {
  const users = (
    await Promise.all(
      (
        await redis.scanForPattern(
          `${groupsKey.bindNickname}${keyDivider}${guildID}*`
        )
      ).map(async (key) => {
        return (await redis.get(key)) as userData;
      })
    )
  ).filter((user) => nicknames.includes(user.nickname));
  return users;
};
