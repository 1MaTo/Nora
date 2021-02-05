import { client } from "../bot";
import { groupsKey, keyDivider } from "../redis/kies";
import { redis } from "../redis/redis";
import { log } from "./log";

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
  ).filter(
    (user) => nicknames.includes(user.nickname) && user.settings.ping_on_start
  );
  return (
    await Promise.all(
      users.map(async (userData) => {
        try {
          const user = await client.users.fetch(userData.discordID, false);
          return {
            ...userData,
            user,
          };
        } catch (error) {
          log(error);
          return null;
        }
      })
    )
  ).filter((data) => data !== null);
};
