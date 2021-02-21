import { getGamesDataByIds, saveMapStats } from "../db/queries";
import { gameStatsResults } from "../embeds/gameStats";
import { getMessageById, sendResponse } from "./discordMessage";
import { botStatusInfo } from "./events";
import { botStatusVariables, numberToEmoji, palette } from "./globals";
import { log } from "./log";
import { searchMapConfigByMapName } from "./mapConfig";

export const collectGamesData = async (
  gamesID: Array<number>,
  channelID: string,
  guildID: string
) => {
  const gamesData = await getGamesDataByIds(gamesID, guildID);
  await Promise.all(
    gamesData.map(async (game) => {
      if (game.players.length < 2) return;
      const config = await searchMapConfigByMapName(game.map, guildID);
      if (!config || config.options.ranking === false) return;
      sendGameResult(game, channelID);
    })
  );
};

const sendGameResult = async (
  gameData: gameDataByIdsGamestats,
  channelID: string
) => {
  if (botStatusVariables.gameCount > 0) {
    botStatusVariables.gameCount -= 1;
    botStatusInfo.emit(botEvent.update);
  }
  await sendResponse(channelID, {
    embed: gameStatsResults(gameData),
  });

  /* try {
    gameData.players.forEach(async (_, index) => {
      currReaction.push(numberToEmoji(index + 1));
      await message.react(numberToEmoji(index + 1));
    });
    setTimeout(
      () => endGameCollector(gameData, message.id, channelID, currReaction),
      deleteDelay
    );
  } catch (error) {
    log(error);
    endGameCollector(gameData, message.id, channelID, currReaction);
  } */
};

/* const endGameCollector = async (
  gameData: gameDataByIdsGamestats,
  messageID: string,
  channelID: string,
  reactions = []
) => {
  const message = await (await getMessageById(messageID, channelID)).fetch(
    true
  );
  const reactionsCount = reactions.map(
    (reactionId) => message.reactions.cache.get(reactionId).count
  );
  const mostReactCount = Math.max(...reactionsCount);
  if (mostReactCount <= 1) return message.delete();
  const winTeam = reactionsCount.indexOf(mostReactCount);
  if (
    reactionsCount.every((reactCount) => reactCount === reactionsCount[winTeam])
  )
    return message.delete();
  await saveMapStats(gameData.id, winTeam);
  await message.reactions.removeAll();
  await message.edit({
    embed: gameStatsResults(gameData, winTeam, palette.green),
  });
  return;
}; */
