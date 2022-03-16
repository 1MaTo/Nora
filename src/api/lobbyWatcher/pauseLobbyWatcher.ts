import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { timeOutKeys } from "../../utils/globals";
import { sleep } from "../../utils/sleep";
import { resumeLobbyWatcher } from "./resumeLobbyWatcher";
import {
  getLobbyWatcherSettings,
  updateLobbyWatcherSettings,
} from "./settingsApi";

export const pauseLobbyWatcher = async (guildID: string, delay?: number) => {
  const settings = await getLobbyWatcherSettings(guildID);

  if (!settings) return;

  settings.paused = true;

  clearTimeout(timeOutKeys.get("lobby-watcher-pause"));
  const timeoutKey =
    delay && setTimeout(() => resumeLobbyWatcher(guildID), delay);

  timeOutKeys.set("lobby-watcher-pause", timeoutKey);
  await updateLobbyWatcherSettings(guildID, { ...settings });

  await sleep(settings.delay);

  return timeoutKey || null;
};
