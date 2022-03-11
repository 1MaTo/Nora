import axios from "axios";
import FormData from "form-data";
import fsExtra from "fs-extra";
import { ghost } from "../auth.json";
import { clearMapUploadsFolder, uploadsMapFolder } from "./downloadFile";
import { ghostApiTimeout } from "./globals";
import { log } from "./log";
import { sleep } from "./sleep";

const botUrl = `http://${ghost.host}:${ghost.port}`; /* production
  ? `http://${ghost.host}:${ghost.port}`
  : `http://${ghost.debugHost}:${ghost.debugPort}`; */
const chatLogs = `${botUrl}/chat?pass=${ghost.password}`;
const chatRowsCount = `${botUrl}/checkchat`;
const commandUrl = (command: string) =>
  `${botUrl}/cmd?pass=${ghost.password}&cmd=${escape(command)}`;

export const getChatRows = async () => {
  try {
    const result = await axios.get(chatRowsCount, { timeout: 1000 });
    return result.data;
  } catch (error) {
    return null;
  }
};

export const getChatLogs = async (): Promise<Array<string | null>> => {
  try {
    const result = await axios.get(chatLogs, { timeout: ghostApiTimeout });

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
    const result = await axios.get(commandUrl(command), {
      timeout: ghostApiTimeout,
    });
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
        const rawLogs = await getChatLogs();
        if (!rawLogs) {
          timeout -= interval;
          await sleep(interval);
          return;
        }
        const logs = rawLogs.slice(-Math.abs(rows - currRows));
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

export const uploadMapToGhost = async (configName: string, mapName: string) => {
  const form = new FormData();

  form.append("textline", configName);
  form.append(
    "datafile",
    fsExtra.createReadStream(`${uploadsMapFolder}/${mapName}`),
    mapName
  );

  try {
    await axios.post(`${botUrl}/UPLOAD`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        log(`[upload map] ${percentCompleted}`);
      },
      timeout: 1000 * 60 * 2,
    });

    await clearMapUploadsFolder(uploadsMapFolder);
    return true;
  } catch (err) {
    log("[upload map to bot] error when uploading map", err);
    await clearMapUploadsFolder(uploadsMapFolder);
    return false;
  }
};

export const getConfigListFromGhost = async () => {
  try {
    const result = await axios.get(`${botUrl}/CFGS`, {
      timeout: ghostApiTimeout,
    });
    const configs = result.data.match(/<th>(.*?)<\/th>/g);
    return configs
      ? configs
          .map((item: string) => item.replace(/<th>|<\/th>/g, ""))
          .slice(configs.length - 25)
      : [];
  } catch (error) {
    log("[getting config from ghost]", error);
    return false;
  }
};
