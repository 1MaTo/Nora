import { client } from "../bot";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";

export const clearRedisOnStart = async () => {
  const clearRedis = client.guilds.cache.map(async (guild) => {
    const uploadingMapKey = redisKey.struct(groupsKey.uploadingMap, [guild.id]);
    await redis.del(uploadingMapKey);
  });

  await Promise.all(clearRedis);
};
