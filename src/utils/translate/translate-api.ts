import { googleTranslateApi } from "./translate-api.google.ts";
import { yandexTranslateApi } from "./translate-api.yandex.ts";
import { TranslateProvider, type TranslateApi } from "./types.ts";

export const translateApi: Record<TranslateProvider, TranslateApi> = {
  [TranslateProvider.enum.yandex]: yandexTranslateApi,
  [TranslateProvider.enum.google]: googleTranslateApi,
};
