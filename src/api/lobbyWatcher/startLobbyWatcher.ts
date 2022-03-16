import { MessageActionRow } from "discord.js";
import { hostGameButtonDefault } from "../../components/buttons/hostGame";
import { showConfigSelectorButtonDefault } from "../../components/buttons/showConfigSelector";
import { header } from "../../embeds/lobby";
import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { sendResponse } from "../../utils/discordMessage";
import { log } from "../../utils/log";
import { getPassedTime } from "../../utils/timePassed";
import { headerMsgUpdater } from "./headerMsgUpdater";
import { lobbyWatcherUpdater } from "./lobbyWatcherUpdater";

export const startLobbyWatcher = async (
  guildID: string,
  channelID: string,
  delay: number,
  botid?: number
) => {
  try {
    //const startTime = Date.now();

    /* const headerMsg = await sendResponse(channelID, {
      embeds: [header(0)],
      components: [
        new MessageActionRow().addComponents(
          hostGameButtonDefault(),
          showConfigSelectorButtonDefault()
        ),
      ],
    }); */

    const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);

    const result = await redis.set(key, {
      channelID: channelID,
      guildID: guildID,
      delay: delay,
      headerID: "",
      activeLobbyCount: 0,
      botid: botid,
      paused: false,
      lobbysID: [],
    } as lobbyWatcherInfo);

    if (result === undefined) {
      log("[start lobby watcher] cant set redis data");
      return false;
    }

    headerMsgUpdater(guildID, delay);
    return true;
  } catch (error) {
    log(error);
    return false;
  }
};
