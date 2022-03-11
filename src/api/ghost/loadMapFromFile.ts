import {
  checkLogsForKeyWords,
  getChatRows,
  sendCommand,
} from "../../utils/requestToGuiServer";

export const loadMapFromFile = async (map: string) => {
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
    const matched = result.match(/[^/]+$/)[0];
    return matched ? matched.slice(0, -5) : true;
  }
  return result;
};
