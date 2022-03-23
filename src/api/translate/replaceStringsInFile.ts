import { formatStringQuotes } from "./formatStringQuotes";
import { formatStringSymbols } from "./formatStringSymbols";
import { formatStringWords } from "./formatStringWords";
import { getTemporarilyReplacedFileKey } from "./getMessageArray";

export const replaceStringsInFile = (
  fileDataWithKeys: string,
  translatedString: string[],
  skipReplace?: boolean,
  isCodeFile?: boolean
) => {
  const replacedWithTranslationString = translatedString.reduce(
    (translatedData, str, index) => {
      const replacedWords = formatStringWords(str);

      const replacedSymbols = skipReplace
        ? replacedWords
        : formatStringSymbols(replacedWords);

      const replaceQuotes = isCodeFile
        ? formatStringQuotes(replacedSymbols)
        : replacedSymbols;

      return translatedData.replaceAll(
        getTemporarilyReplacedFileKey(index),
        replaceQuotes
      );
    },
    fileDataWithKeys
  );

  return replacedWithTranslationString;
};
