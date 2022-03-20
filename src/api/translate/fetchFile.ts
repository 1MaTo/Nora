import axios from "axios";
import { log } from "../../utils/log";

export const fetchFile = async (fileUrl: string) => {
  try {
    const result = await axios.get(fileUrl);
    return result.data;
  } catch (error) {
    log("[fetch file] cant get file");
  }
};
