import { client } from "../bot";
import { botStatusVariables, numberToEmoji, production } from "./globals";
import { log } from "./log";

export const changeBotStatus = async (message: string) => {
  try {
    if (!production) return;
    await client.user.setActivity(message);
    return;
  } catch (error) {
    log(error);
    return;
  }
};

export const updateStatusInfo = async () => {
  const ghost = `Ghost: ${botStatusVariables.ghost ? "✅" : "❌"}`;

  if (!botStatusVariables.ghost) return await changeBotStatus(`${ghost}`);

  const lobby = botStatusVariables.lobbyCount
    ? ` | Lobby: ${numberToEmoji(botStatusVariables.lobbyCount)}`
    : "";
  const games = botStatusVariables.gameCount
    ? ` | Games: ${numberToEmoji(botStatusVariables.gameCount)}`
    : "";

  await changeBotStatus(`${ghost}${lobby}${games}`);
};
