import {
  checkLogsForKeyWords,
  getChatRows,
  sendCommand,
} from "../../utils/requestToGuiServer";

export const loadMap = async (map: string) => {
  const rows = await getChatRows();
  const commandSend = sendCommand(`map ${map ? map : ""}`);
  if (!commandSend) return null;
  const result = await checkLogsForKeyWords(
    /MAP] loading MPQ file/,
    rows,
    500,
    3000
  );
  if (result) {
    return result.match(/[^\\]+$/)[0].slice(0, -5);
  }
  return result;
};
