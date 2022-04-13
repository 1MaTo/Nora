import { groupsKey, redisKey } from "../../../redis/kies";
import { redis } from "../../../redis/redis";
import { zipString } from "../../zip/zipString";

export const generateReportFileData = async () => {
  const key = redisKey.struct(groupsKey.reportLog, []);
  const logs = (await redis.get(key)) || [];

  const stringData = logs.join("\n");

  let data = Buffer.from(stringData, "utf-8");
  let fileName = "report.txt";

  if (data.length > 8283750) {
    data = Buffer.from(await zipString(fileName, stringData));
    fileName.replace(".txt", ".zip");
  }

  return { file: data, fileName: fileName };
};
