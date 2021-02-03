import { getGamesDataByIds, saveMapStats } from "../db/queries";
import { gameStatsPoll } from "../embeds/gameStats";
import { getMessageById, sendResponse } from "./discordMessage";
import { numberToEmoji, palette } from "./globals";
import { log } from "./log";
import { searchMapConfigByMapName } from "./mapConfig";

export const startGamestatsPolls = async (
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
      startGameCollector(game, channelID);
    })
  );
};

const startGameCollector = async (
  gameData: gameDataByIdsGamestats,
  channelID: string
) => {
  const deleteDelay = 1000 * 60 * 10;
  const message = await sendResponse(channelID, {
    embed: gameStatsPoll(gameData),
  });
  const currReaction = [];
  try {
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
  }
};

const endGameCollector = async (
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
    embed: gameStatsPoll(gameData, winTeam, palette.green),
  });
  return;
};
