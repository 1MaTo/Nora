import { getLobbyList } from "../../db/queries";
import { header } from "../../embeds/lobby";
import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import {
  editMessage,
  getMessageById,
  sendResponse,
} from "../../utils/discordMessage";
import { selectMenuId } from "../../utils/globals";
import { log } from "../../utils/log";
import { runNewLobbies } from "../../utils/runNewLobbies";
import { getCommandHubState } from "./getCurrentCommandHub";

export const headerMsgUpdater = async (guildID: string, delay: number) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  if (settings === undefined) {
    log("[header msg updater] redis error");
    goToNextUpdate(guildID, delay);
    return;
  }

  if (settings === null) {
    log("[header msg updater] deleted");
    return;
  }

  if (settings.paused) {
    log("[header msg updater] stopped");
    goToNextUpdate(guildID, delay);
    return;
  }

  const lobbyList = await getLobbyList(settings.botid);

  if (!lobbyList) {
    log("[header msg updater] cant get lobby list");
    goToNextUpdate(guildID, delay);
    return;
  }

  await runNewLobbies(settings, lobbyList);

  const msg = await getMessageById(settings.headerID, settings.channelID);

  const msgEmbeds = [header(lobbyList.length, settings.lastLoadedMap) as any];
  const msgComponents = getCommandHubState(lobbyList.length !== 0);

  if (!msg) {
    log("[header msg updater] cant get prev msg, creating new one");
    const newMsg = await sendResponse(settings.channelID, {
      embeds: msgEmbeds,
      components: msgComponents,
    });

    await redis.set(key, {
      ...settings,
      headerID: newMsg ? newMsg.id : null,
      forceUpdate: false,
    } as lobbyWatcherInfo);

    goToNextUpdate(guildID, delay);
    return;
  }

  const selectConfigMenu = msg.resolveComponent(
    selectMenuId.selectMapConfigWatcherHub
  );

  const infoChanged =
    lobbyList.length !== settings.activeLobbyCount ||
    settings.forceUpdate ||
    selectConfigMenu;

  if (!infoChanged) {
    goToNextUpdate(guildID, delay);
    return;
  }

  log("[header msg updater] updating msg");

  await redis.set(key, {
    ...settings,
    activeLobbyCount: lobbyList.length,
    forceUpdate: false,
  } as lobbyWatcherInfo);

  await editMessage(msg, {
    embeds: msgEmbeds,
    components: msgComponents,
  });

  goToNextUpdate(guildID, delay);
  return;
};

const goToNextUpdate = (guildID: string, delay: number) => {
  setTimeout(() => headerMsgUpdater(guildID, delay), delay);
};
