import { getGamesDataByIds } from "../db/queries";
import { gameStatsResults } from "../embeds/gameStats";
import { sendResponse } from "./discordMessage";
import { botEvents } from "./events";
import { botStatusVariables } from "./globals";
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
    botEvents.emit(botEvent.update);
  }
  await sendResponse(channelID, {
    embeds: [gameStatsResults(gameData) as any],
  });
};
