import z from "zod";

export type TranslateApi = {
  translateHTMLStringList: (props: {
    list: string[];
    source: TranslateLanguage;
    target: TranslateLanguage;
    glossary?: Glossary;
  }) => Promise<string[]>;
  getTranslationCostInRUB?: (charCount: number) => string;
};

export const TranslateLanguage = z.enum(["ko", "zh", "ru", "en"]);
export type TranslateLanguage = z.infer<typeof TranslateLanguage>;

/** First key is source language, second is s target */
export type Glossary = Partial<
  Record<
    TranslateLanguage,
    { source: string; target: Partial<Record<TranslateLanguage, string>> }[]
  >
>;

export const TranslateProvider = z.enum(["google", "yandex"]);
export type TranslateProvider = z.infer<typeof TranslateProvider>;
