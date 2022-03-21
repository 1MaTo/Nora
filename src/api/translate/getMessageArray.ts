export const getTemporarilyReplacedFileKey = (str: any) => {
  return `[NORA_T_ITEM]${str}[/NORA_T_ITEM]`;
};

export const getMessageArray = (file: string): DataToTranslate => {
  const regExp =
    /(\+\d{1,}%{0,}){0,}(【[\u4E00-\u9FA5一-龠ぁ-ゔァ-ヴー\dX]{1,}】){0,}[\u4E00-\u9FA5一-龠ぁ-ゔァ-ヴー]{1,}([%。\/ \)\(）（\.,+：·【】，~-]{0,}|\d{0,}|[a-zA-Z]{0,}|[\u4E00-\u9FA5一-龠ぁ-ゔァ-ヴー、。]{0,}){0,}/gimu;

  const matched = Array.from(new Set(file.match(regExp)));

  if (matched.length === 0) return null;

  matched.sort((a, b) => b.length - a.length);

  const data = matched.reduce(
    (translateData, item, index) => {
      const key = getTemporarilyReplacedFileKey(index);

      translateData.str = translateData.str.replaceAll(item, key);
      translateData.itemList.push([key, item]);
      return translateData;
    },
    { str: file, itemList: [] }
  );

  return data;
};
