import { yandexRequest } from "./yandexRequest";

export const getLanguageList = async () => {
  const result = await yandexRequest(
    "https://translate.api.cloud.yandex.net/translate/v2/languages"
  );

  if (!result) return null;

  return (result as YandexLanguageListResponse).languages;
};
