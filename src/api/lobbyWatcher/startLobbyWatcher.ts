import { header } from "../../embeds/lobby";
import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { sendResponse } from "../../utils/discordMessage";
import { log } from "../../utils/log";
import { getPassedTime } from "../../utils/timePassed";
import { lobbyWatcherUpdater } from "./lobbyWatcherUpdater";

export const startLobbyWatcher = async (
  guildID: string,
  channelID: string,
  delay: number
) => {
  try {
    const startTime = Date.now();

    const headerMsg = await sendResponse(channelID, {
      embeds: [header(0, getPassedTime(startTime, Date.now()))],
    });
    const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);

    redis.set(key, {
      startTime: startTime,
      channelID: channelID,
      guildID: guildID,
      delay: delay,
      headerID: headerMsg.id,
      lobbysID: [],
    } as lobbyWatcherInfo);

    setTimeout(() => lobbyWatcherUpdater(guildID), delay);
    return true;
  } catch (error) {
    log(error);
    return false;
  }
};
