import { YANDEX } from "#env";

import { ApiError } from "../shared/error/api-error.ts";
import type { Glossary, TranslateApi, TranslateLanguage } from "./types.ts";

type YandexTranslateResult = {
  translations: [
    {
      text?: string;
    },
  ];
};

type YandexGlossaryConfig = {
  glossaryData: {
    glossaryPairs: YandexGlossaryPair[];
  };
};

type YandexGlossaryPair = {
  sourceText: string;
  translatedText: string;
  exact?: boolean;
};

type YandexApiError = {
  code: number;
  message: string;
};

export const yandexTranslateApi: TranslateApi = {
  translateHTMLStringList: async ({ list, source, target, glossary }) => {
    const response = await fetch("https://translate.api.cloud.yandex.net/translate/v2/translate", {
      method: "POST",
      headers: { Authorization: `Api-Key ${YANDEX.API_KEY}` },

      body: JSON.stringify({
        folderId: YANDEX.FOLDER_ID,
        format: "HTML",
        texts: list,
        sourceLanguageCode: source,
        targetLanguageCode: target,
        glossaryConfig: parseGlossary(source, target, glossary) || undefined,
      }),
    });

    if (!response.ok) {
      const message = ((await response.json()) as YandexApiError).message;
      throw new ApiError(response, message);
    }

    const result = ((await response.json()) as YandexTranslateResult).translations;

    const resultList: string[] = [];
    for (let index = 0; index < result.length; index++) {
      resultList.push(result[index].text || "");
    }

    return resultList;
  },
  getTranslationCostInRUB: (count: number) => `${(count * 0.001).toFixed(2)}₽`,
};

const parseGlossary = (
  source: TranslateLanguage,
  target: TranslateLanguage,
  glossary?: Glossary,
): YandexGlossaryConfig | null => {
  if (!glossary || !glossary[source] || !glossary[source].length) return null;

  const yandexGlossary: YandexGlossaryPair[] = [];

  for (let index = 0; index < glossary[source].length; index++) {
    const sourceInfo = glossary[source][index];
    if (!sourceInfo.target[target]) continue;
    yandexGlossary.push({
      sourceText: sourceInfo.source,
      translatedText: sourceInfo.target[target],
    });
  }

  if (!yandexGlossary.length) return null;

  return {
    glossaryData: { glossaryPairs: yandexGlossary },
  };
};
