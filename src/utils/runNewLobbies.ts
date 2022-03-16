import { lobbyMsgUpdater } from "../api/lobbyWatcher/lobbyMsgUpdater";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { log } from "./log";

export const runNewLobbies = async (
  { guildID, channelID, delay }: lobbyWatcherInfo,
  lobbyList: lobbyGame[]
) => {
  const runUpdaters = lobbyList.map(async (lobby) => {
    const key = redisKey.struct(groupsKey.lobbyGameWatcher, [
      guildID,
      channelID,
      lobby.botid.toString(),
    ]);
    const lobbyGameWatcher = await redis.get(key);

    if (lobbyGameWatcher) {
      //log(`[run new lobbies] game already watched [${lobby.botid}]`);
      return;
    }

    log(`[run new lobbies] running new lobby game updater [${lobby.botid}]`);
    await redis.set(key, {
      botid: lobby.botid,
      delay,
      msgId: "",
    } as lobbyGameWatcherInfo);
    lobbyMsgUpdater(guildID, lobby.botid, delay);
  });

  return Promise.all(runUpdaters);
};
