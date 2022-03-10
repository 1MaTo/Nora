import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { getTextChannel } from "../../utils/discordChannel";
import { log } from "../../utils/log";

export const stopLobbyWatcher = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  if (settings) {
    const channel = await getTextChannel(settings.channelID);
    const lobbiesToMsgID = settings.lobbysID.reduce(
      (arr, curr) => [...arr, curr.messageID],
      []
    );
    try {
      await channel.bulkDelete([settings.headerID, ...lobbiesToMsgID]);
    } catch (err) {
      log("[stop watcher] cant delete messages", err);
    }
  }
  await redis.del(key);
  return;
};
