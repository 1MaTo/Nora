export const formatStringSymbols = (str: string) => {
  let finalString = str;
  //    Get all number with X at the end
  const matchedNumbers = finalString.match(/\d{1,}(\.\d){0,}X/gimu);
  finalString =
    matchedNumbers?.reduce((str, item) => {
      return str.replace(item, item.replace("X", " X"));
    }, finalString) || finalString;

  return finalString
    .replaceAll(",", "， ")
    .replaceAll("：", ": ")
    .replaceAll(":", ": ")
    .replaceAll(".", ". ")
    .replaceAll(")", " )")
    .replaceAll("(", "( ")
    .replaceAll("/", " / ")
    .replaceAll("~", " ~ ")
    .replaceAll("-", " - ")
    .replace(/^\+ */gimu, "+ ")
    .replace(/(?!^) {0,}\+ {0,}/gimu, " + ")
    .replaceAll(/(?!^)【/gimu, " [")
    .replaceAll("【", "[")
    .replaceAll(/】(?!$)/gimu, "] ")
    .replaceAll("】", "]")
    .replaceAll(/ {0,}seconds/gim, " seconds")
    .replace(/ {1,}/gimu, " ");
};
