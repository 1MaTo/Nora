import { ghostCmd } from "../../utils/globals";
import {
  checkLogsForKeyWords,
  getChatRows,
  sendCommand,
} from "../../utils/requestToGuiServer";

export const pubGame = async (gamename: string | undefined) => {
  const rows = await getChatRows();
  const commandSent = sendCommand(`pub ${gamename ? gamename : ""}`);
  if (!commandSent) return null;
  const result = await checkLogsForKeyWords(
    /creating game \[.*\]/,
    rows,
    ghostCmd.requestInterval,
    ghostCmd.pendingTimeout
  );
  if (result) {
    return result.match(/ \[.*\]/)[0];
  }
  return result;
};
