export const getMessageArray = (file: string): DataToTranslate => {
  const regExp =
    /[\u4E00-\u9FA5一-龠ぁ-ゔァ-ヴー]{1,}([%。\/ \)\(）（\.+：·]{0,}|\d{0,}|[a-zA-Z]{0,}|[\u4E00-\u9FA5一-龠ぁ-ゔァ-ヴー、。]{0,}){0,}/gimu;

  const matched = Array.from(new Set(file.match(regExp)));

  if (matched.length === 0) return null;

  const data = matched.reduce(
    (translateData, item, index) => {
      const key = `[NORA_T_ITEM]${index}[/NORA_T_ITEM]`;

      translateData.str = translateData.str.replace(new RegExp(item, "g"), key);
      translateData.itemList.push([key, item]);
      return translateData;
    },
    { str: file, itemList: [] }
  );

  return data;
};
