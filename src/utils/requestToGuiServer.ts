import axios from "axios";
import { ghost } from "../auth.json";
import { log } from "./log";
import { sleep } from "./sleep";

const botUrl = `http://${ghost.host}:${ghost.port}`;
const chatLogs = `${botUrl}/chat?pass=${ghost.password}`;
const chatRowsCount = `${botUrl}/checkchat`;
const commandUrl = (command: string) =>
  `${botUrl}/cmd?pass=${ghost.password}&cmd=${escape(command)}`;

export const getChatRows = async () => {
  try {
    const result = await axios.get(chatRowsCount);

    return result.data;
  } catch (error) {
    return null;
  }
};

export const getChatLogs = async (): Promise<Array<string | null>> => {
  try {
    const result = await axios.get(chatLogs);

    const logs = result.data
      .toString()
      .replace(/&nbsp;/g, " ")
      .replace(/\[ {8}/g, "[")
      .split("<br>");
    logs.pop();
    return logs;
  } catch (error) {
    return null;
  }
};

export const sendCommand = async (command: string) => {
  try {
    const result = await axios.get(commandUrl(command));
    return true;
  } catch (error) {
    return null;
  }
};

export const checkLogsForKeyWords = async (
  pattern: RegExp,
  rows: number,
  interval: number,
  abortTimeout: number = 5000
): Promise<string | null | false> => {
  try {
    let timeout = abortTimeout;
    while (timeout > 0) {
      const currRows = await getChatRows();
      if (currRows !== rows) {
        const logs = (await getChatLogs()).slice(-Math.abs(rows - currRows));
        const patternSuccess = logs.reduce((arr, row) => {
          if (row.match(pattern)) return [...arr, row];
          return [...arr];
        }, []);
        if (patternSuccess.length) return patternSuccess[0];
      }
      timeout -= interval;
      await sleep(interval);
    }

    return false;
  } catch (error) {
    log(error);
    return null;
  }
};
