import { translate } from "google-translate-api-x";

import type { TranslateApi } from "./types.ts";

export const googleTranslateApi: TranslateApi = {
  translateHTMLStringList: async ({ list, source, target }) => {
    const result = await translate(list, { from: source, to: target, forceBatch: false });

    const resultList: string[] = [];
    for (let index = 0; index < result.length; index++) {
      resultList.push(result[index].text || "");
    }

    return resultList;
  },
  getTranslationCostInRUB: () => `free`,
};
