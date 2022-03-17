import { headerMsgUpdater } from "../api/lobbyWatcher/headerMsgUpdater";
import { getLobbyWatcherSettings } from "../api/lobbyWatcher/settingsApi";
import { groupsKey, keyDivider, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { guildIDs, production } from "./globals";
import { log } from "./log";
import { gamestatsUpdater } from "./timerFuncs";

export const restartLobbyWatcher = async () => {
  const lobbyWatcherKeys = await redis.scanForPattern(
    `${groupsKey.lobbyWatcher}${keyDivider}*`
  );
  lobbyWatcherKeys &&
    (await Promise.all(
      lobbyWatcherKeys.map(async (key) => {
        const keys = redisKey.destruct(key);
        const settings = await getLobbyWatcherSettings(keys[0]);
        if (!settings) return;
        if (!production && keys[0] !== guildIDs.debugGuild) return;
        log("[restart lobby watcher] starting lobby watcher");
        headerMsgUpdater(keys[0], settings.delay);
      })
    ));

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
