import { yandexRequest } from "./yandexRequest";

export const translateYandex = async (requestData: YandexTranslateRequest) => {
  const result = await yandexRequest(
    "https://translate.api.cloud.yandex.net/translate/v2/translate",
    { ...requestData, speller: false }
  );
  return result as YandexTranslateResponse | null;
};
