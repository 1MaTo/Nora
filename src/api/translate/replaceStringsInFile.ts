import { log } from "../../utils/log";
import { formatStringSymbols } from "./formatStringSymbols";
import { getTemporarilyReplacedFileKey } from "./getMessageArray";

export const replaceStringsInFile = (
  fileDataWithKeys: string,
  translatedString: string[]
) => {
  const replacedWithTranslationString = translatedString.reduce(
    (translatedData, str, index) => {
      const formatedString = formatStringSymbols(str);
      log(formatedString);
      return translatedData.replaceAll(
        getTemporarilyReplacedFileKey(index),
        formatedString
      );
    },
    fileDataWithKeys
  );

  return replacedWithTranslationString;
};
