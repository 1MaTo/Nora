import { getFinishedGamesId, getLobbyList } from "../db/queries";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { botStatusInfo } from "./events";
import { collectGamesData } from "./gamestatsUtils";
import { botStatusVariables } from "./globals";
import { getChatRows, getCurrentGamesCount } from "./requestToGuiServer";

export const gamestatsUpdater = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.gameStats, [guildID]);
  const settings = (await redis.get(key)) as gamestatsInfo;

  if (!settings) return;

  const ids = await getFinishedGamesId();

  if (!ids)
    return setTimeout(() => gamestatsUpdater(settings.guildID), settings.delay);

  if (!settings.prevGamesCount) {
    settings.prevGamesCount = ids.length;
    await redis.set(key, settings);
  }

  if (ids.length - settings.prevGamesCount < 0) {
    settings.prevGamesCount = ids.length;
    await redis.set(key, settings);
  }

  const newGamesCount = ids.length - settings.prevGamesCount;

  if (newGamesCount > 0) {
    settings.prevGamesCount = ids.length;
    await redis.set(key, settings);
    const idToPoll = ids.splice(-newGamesCount);
    collectGamesData(idToPoll, settings.channelID, settings.guildID);
  }
  setTimeout(() => gamestatsUpdater(settings.guildID), settings.delay);
};

export const ghostStatusUpdater = async () => {
  const rows = await getChatRows();
  const changedState = botStatusVariables.ghost !== Boolean(rows);
  if (changedState) {
    botStatusVariables.ghost = Boolean(rows);
    botStatusInfo.emit(botEvent.update);
  }
  setTimeout(() => ghostStatusUpdater(), 5000);
};

export const lobbyStatusUpdater = async () => {
  const games = (await getLobbyList()).filter(
    (game) =>
      !(
        game.gamename === "" &&
        game.ownername === "" &&
        game.creatorname === ""
      )
  );

  const changedState = botStatusVariables.lobbyCount !== games.length;

  if (changedState) {
    botStatusVariables.lobbyCount = games.length;
    botStatusInfo.emit(botEvent.update);
  }
  setTimeout(() => lobbyStatusUpdater(), 5000);
};

export const gamesStatusUpdater = async (delay: number) => {
  const gameCount = await getCurrentGamesCount();

  botStatusVariables.gameCount = gameCount;

  if (gameCount !== botStatusVariables.gameCount)
    botStatusInfo.emit(botEvent.update);

  setTimeout(() => gamesStatusUpdater(delay), delay);
};
