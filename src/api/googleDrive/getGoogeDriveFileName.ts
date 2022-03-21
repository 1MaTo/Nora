import axios from "axios";
import { log } from "../../utils/log";

export const getGoogeDriveFileName = async (url: string) => {
  try {
    const googleFileResponse = await axios.get(url);
    return googleFileResponse.data.name as string;
  } catch (error) {
    log("[getting google drive file name] cant get name");
    return false;
  }
};
