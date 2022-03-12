import axios from "axios";
import { createWriteStream } from "fs";
import * as stream from "stream";
import { promisify } from "util";
import { log } from "./log";
import fsExtra from "fs-extra";
import { formatBytes } from "./formatBytes";

const finished = promisify(stream.finished);

export const uploadsMapFolder = __dirname + "/../../../uploads";
const max_size = 1073741824;

const checkSize = async (link: string) => {
  const result = await axios({
    method: "HEAD",
    url: link,
  });
  const length = parseInt(result.headers["content-length"]);
  log("[check file size] " + formatBytes(length));
  return length < max_size;
};

export const downloadFile = async (link: string, fileName: string) => {
  try {
    const isAcceptSize = await checkSize(link);

    if (!isAcceptSize) return false;

    const result = await axios({
      method: "GET",
      responseType: "stream",
      url: link,
    });
    const writer = createWriteStream(`${uploadsMapFolder}/${fileName}.w3x`);
    result.data.pipe(writer);
    await finished(writer);
    return true;
  } catch (err) {
    log("[download file] error when dowloading", err);
    await clearMapUploadsFolder(uploadsMapFolder);
    return false;
  }
};

export const clearMapUploadsFolder = async (pathToFolder: string) => {
  try {
    await fsExtra.emptyDir(pathToFolder);
  } catch (err) {
    log("[delete files in folder] error when deleting", err);
    return false;
  }
  return true;
};
