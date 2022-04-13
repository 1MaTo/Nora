import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";

export const addToReports = async (message: any) => {
  let str = "";

  const key = redisKey.struct(groupsKey.reportLog, []);
  const logs = (await redis.get(key)) || [];

  try {
    str = JSON.stringify(message);
  } catch (error) {
    str = String(message);
  }

  if (logs.length > 1000) {
    logs.shift();
  }

  logs.push(
    `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] ${str}`
  );

  await redis.set(key, logs);
};
