import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { getTextChannel } from "../../utils/discordChannel";

export const stopLobbyWatcher = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  if (settings) {
    const channel = await getTextChannel(settings.channelID);
    const lobbiesToMsgID = settings.lobbysID.reduce(
      (arr, curr) => [...arr, curr.messageID],
      []
    );
    await channel.bulkDelete([settings.headerID, ...lobbiesToMsgID]);
  }
  await redis.del(key);
  return;
};
