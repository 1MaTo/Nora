import { groupsKey, keyDivider, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { getTextChannel } from "../../utils/discordChannel";
import { log } from "../../utils/log";

export const stopLobbyWatcher = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  await redis.set(key, { ...settings, paused: true } as lobbyWatcherInfo);

  if (settings) {
    const channel = await getTextChannel(settings.channelID);

    const lobbyGamesMsgIdList = await getLobbyGameMsgIdList(
      settings.guildID,
      settings.channelID
    );

    try {
      await channel.bulkDelete([settings.headerID, ...lobbyGamesMsgIdList]);
    } catch (err) {
      log("[stop watcher] cant delete messages", err);
    }
  }
  const lobbyGamesKeys =
    (await redis.scanForPattern(
      `${groupsKey.lobbyGameWatcher}${keyDivider}${guildID}${keyDivider}${settings.channelID}${keyDivider}*`
    )) || [];

  await redis.del([key, ...lobbyGamesKeys]);

  return;
};

const getLobbyGameMsgIdList = async (guildID: string, channelID: string) => {
  const lobbyGamesKeys = await redis.scanForPattern(
    `${groupsKey.lobbyGameWatcher}${keyDivider}${guildID}${keyDivider}${channelID}${keyDivider}*`
  );

  if (!lobbyGamesKeys) return [];

  return await Promise.all(
    lobbyGamesKeys.map(async (key) => {
      const item = (await redis.get(key)) as lobbyGameWatcherInfo | null;

      if (!item) return null;

      return item.msgId;
    })
  );
};
