import { groupsKey, keyDivider, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { gamestatsUpdater, lobbyWatcherUpdater } from "./timerFuncs";

export const restartLobbyWatcher = async () => {
  const lobbyWatcherKeys = await redis.scanForPattern(
    `${groupsKey.lobbyWatcher}${keyDivider}*`
  );
  lobbyWatcherKeys &&
    lobbyWatcherKeys.map((key) => {
      const guildID = redisKey.destruct(key);
      lobbyWatcherUpdater(guildID[0]);
    });

  return lobbyWatcherKeys ? lobbyWatcherKeys.length : 0;
};

export const restartGamestats = async () => {
  const gamestatsKeys = await redis.scanForPattern(
    `${groupsKey.gameStats}${keyDivider}*`
  );
  gamestatsKeys &&
    gamestatsKeys.map((key) => {
      const guildID = redisKey.destruct(key);
      gamestatsUpdater(guildID[0]);
    });

  return gamestatsKeys ? gamestatsKeys.length : 0;
};
