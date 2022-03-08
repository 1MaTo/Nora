import { ghostCmd } from "../../utils/globals";
import {
  checkLogsForKeyWords,
  getChatRows,
  sendCommand,
} from "../../utils/requestToGuiServer";

export const unhostGame = async () => {
  const rows = await getChatRows();
  const commandSent = sendCommand("unhost");
  if (!commandSent) return null;
  const result = await checkLogsForKeyWords(
    /deleting current game \[.*\]/,
    rows,
    ghostCmd.requestInterval,
    ghostCmd.pendingTimeout
  );
  if (result) {
    return result.match(/ \[.*\]/)[0];
  }
  return result;
};
