import axios from "axios";
import { yandesOAuth } from "../../auth.json";
import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { log } from "../../utils/log";

export const getIAMToken = async (): Promise<string | null> => {
  try {
    const key = redisKey.struct(groupsKey.yandexIAMToken, ["NORA_TOKEN"]);
    const oldKey = await redis.get(key);

    if (oldKey) {
      const isExpiredSoon =
        Math.floor((oldKey.expiresAt - Date.now()) / (1000 * 60 * 60)) <= 3;
      if (!isExpiredSoon) {
        log("[get IAM token] return cached key");
        return oldKey.iamToken;
      }
    }

    const result = await axios.post(
      "https://iam.api.cloud.yandex.net/iam/v1/tokens",
      { yandexPassportOauthToken: yandesOAuth }
    );

    if (!result?.data) return null;

    const { iamToken, expiresAt } = result.data;
    await redis.set(key, {
      iamToken,
      expiresAt: Date.parse(new Date(expiresAt).toString()),
    });
    log("[get IAM token] return new api key");
    return iamToken;
  } catch (error) {
    log("[get IAM token] failed to get");
    return null;
  }
};
