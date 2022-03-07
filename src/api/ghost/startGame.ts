import { ghostCmd } from "../../utils/globals";
import {
  checkLogsForKeyWords,
  getChatRows,
  sendCommand,
} from "../../utils/requestToGuiServer";

export const startGame = async (force: boolean) => {
  const rows = await getChatRows();
  const commandSent = await sendCommand(`start ${force ? "force" : ""}`);
  if (!commandSent) return null;
  const result = await checkLogsForKeyWords(
    /GAME:.*started loading with \d+ players/,
    rows,
    1000,
    ghostCmd.pendingTimeout + 4
  );
  if (result) {
    return result.match(/GAME: .*\]/)[0].replace("GAME: ", "[");
  }

  return result;
};
