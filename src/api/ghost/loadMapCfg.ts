import {
  checkLogsForKeyWords,
  getChatRows,
  sendCommand,
} from "../../utils/requestToGuiServer";

export const loadMapCfg = async (map: string) => {
  const rows = await getChatRows();
  const commandSend = sendCommand(`load ${map ? map : ""}`);
  if (!commandSend) return null;
  const result = await checkLogsForKeyWords(
    /CONFIG] loading file/,
    rows,
    500,
    3000
  );
  if (result) {
    return result.match(/[^/]+$/)[0].slice(0, -5);
  }
  return result;
};
