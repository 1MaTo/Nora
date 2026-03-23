import { translate } from "google-translate-api-x";

import { TranslateLanguage, type TranslateApi } from "./types.js";

const languageCodeMap: Partial<Record<TranslateLanguage, string>> = {
  [TranslateLanguage.enum.zh]: "zh-Hans",
};

export const googleTranslateApi: TranslateApi = {
  translateHTMLStringList: async ({ list, source, target }) => {
    const result = await translate(list, {
      from: languageCodeMap[source] || source,
      to: languageCodeMap[target] || target,
      forceFrom: true,
      forceBatch: false,
    });

    const resultList: string[] = [];
    for (let index = 0; index < result.length; index++) {
      resultList.push(result[index].text || "");
    }

    return resultList;
  },
  getTranslationCostInRUB: () => `free`,
};
