import axios from "axios";
import { yandexCatalogId } from "../../auth.json";
import { log } from "../../utils/log";
import { getIAMToken } from "./getIAMToken";

export const yandexRequest = async (url: string, requestData: any) => {
  const token = await getIAMToken();

  if (!token) {
    log("[yandex request] cant get IAM token");
    return null;
  }

  try {
    const result = await axios.post(url, {
      data: { ...requestData, folderId: yandexCatalogId },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!result?.data) return null;

    return result.data as any;
  } catch (error) {
    log("[translate yandex] cant translate");
    return null;
  }
};
