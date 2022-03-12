import axios from "axios";
import FormData from "form-data";
import fs from "node:fs";
import { ghost } from "../auth.json";
import { clearMapUploadsFolder, uploadsMapFolder } from "./downloadFile";
import { ghostApiTimeout } from "./globals";
import { log } from "./log";
import { sleep } from "./sleep";
import util from "node:util";

const botUrl = `http://${ghost.host}:${ghost.port}`; /* `http://127.0.0.1:3000` */
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
    const startMark = `nora start command mark ${Date.now()}`;
    const endMark = `nora end command mark ${Date.now()}`;
    await axios.get(commandUrl(startMark), {
      timeout: ghostApiTimeout,
    });
    await axios.get(commandUrl(command), {
      timeout: ghostApiTimeout,
    });
    await axios.get(commandUrl(endMark), {
      timeout: ghostApiTimeout,
    });
    return [startMark, endMark];
  } catch (error) {
    return null;
  }
};

export const getCurrentGamesCount = async () => {
  try {
    const result = await axios.get(`${botUrl}/INFO`, {
      timeout: ghostApiTimeout,
    });
    const matched = result.data.match(/current Games: \d{1,}/gi);

    if (!matched) return 0;

    const number = parseInt(matched[0].replace(/[^\d]/g, ""));

    if (isNaN(number)) return 0;

    return number;
  } catch (error) {
    return 0;
  }
};

export const whaitForCommandResult = async ({
  startMark,
  endMark,
  successMark,
  errorMark,
}: {
  startMark: string;
  endMark: string;
  successMark: RegExp;
  errorMark?: RegExp;
}): Promise<null | "error" | "success" | "uknown" | "timeout"> => {
  let commandStartMarkExist = false;
  let commandEndMarkExist = false;
  let commandSuccessMarkExist = false;
  let timeOut = false;
  let requestError = false;
  let logs = [];
  const timeStart = Date.now();
  while (!commandStartMarkExist || !commandEndMarkExist) {
    if (Date.now() - timeStart > 1000 * 5) {
      timeOut = true;
      break;
    }

    try {
      const newLogs = (await getChatLogs()) || [];
      logs = [...logs, ...newLogs];
    } catch (err) {
      requestError = true;
      log("[getting ghost command logs] error when getting", err);
      break;
    }

    commandSuccessMarkExist = logs.some((log: string) => successMark.test(log));
    commandStartMarkExist = logs.some((log: string) => log.includes(startMark));
    commandEndMarkExist = logs.some((log: string) => log.includes(endMark));

    await sleep(200);
  }

  if (timeOut && commandSuccessMarkExist) return "success";

  if (timeOut) return "timeout";

  if (requestError) return null;

  logs = Array.from(new Set(logs));

  if (logs.some((row: string) => successMark.test(row))) {
    return "success";
  }

  if (errorMark && logs.some((row: string) => errorMark.test(row))) {
    return "error";
  }

  return "uknown";
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
    fs.createReadStream(`${uploadsMapFolder}/${mapName}`)
  );

  try {
    const submitForm = (form: FormData) => {
      return new Promise((resolve, reject) => {
        form.submit(`${botUrl}/UPLOAD`, async (err, res) => {
          res.resume();
          if (res.statusCode === 200) resolve(res);
          reject(err);
        });
      });
    };

    await submitForm(form);
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
    const cleanStrings = configs
      ? configs.map((item: string) => item.replace(/<th>|<\/th>/g, ""))
      : [];
    return cleanStrings.length > 25
      ? cleanStrings.slice(configs.length - 25)
      : cleanStrings;
  } catch (error) {
    log("[getting config from ghost]", error);
    return false;
  }
};
