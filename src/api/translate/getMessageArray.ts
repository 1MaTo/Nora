export const getTemporarilyReplacedFileKey = (str: any) => {
  return `[NORA_T_ITEM]${str}[/NORA_T_ITEM]`;
};

export const getTemporarilyReplacedColorMarkKey = (str: any) => {
  return `|[NORA_COLOR_MARK_${str}]|`;
};

export const replaceAllColorMarks = (file: string) => {
  const colorMarkRegExp = /(\|\w[A-Za-z\d]{8})/gimu;
  const allMarks = Array.from(new Set(file.match(colorMarkRegExp)));

  if (allMarks.length === 0) return { file, marks: [] };

  return allMarks.reduce(
    ({ file, marks }, mark, index) => {
      const markKey = getTemporarilyReplacedColorMarkKey(index);
      const newStr = file.replaceAll(mark, markKey);

      return { file: newStr, marks: [...marks, { value: mark, key: markKey }] };
    },
    { file, marks: [] as { value: string; key: string }[] }
  );
};

export const returnAllColorMarks = ({
  file,
  marks,
}: {
  file: string;
  marks: { value: string; key: string }[];
}) => {
  return marks.reduce((str, mark) => {
    return str.replaceAll(mark.key, mark.value);
  }, file);
};

export const getMessageArray = (file: string): DataToTranslate => {
  const newRegExp =
    /((\|\w[A-Za-z\d]{8}){0,}[\d\[\]\\\.，。:【！】%“·（ ）”、〈〉\+"\/\(\)：「」『』…\*~※‘’《》①②③④％-]{0,}[\u4E00-\u9FA5]{1,}[A-Za-z\d\[\]\\=\.，。:【！】%“·（ ）”、〈〉\+"\/\(\)：「」『』…\*~※‘’《》①②③④％-]{0,}){1,}/gimu;
  const regExp =
    /(\+\d{1,}%{0,}){0,}(【[\u4E00-\u9FA5一-龠ぁ-ゔァ-ヴー\dX]{1,}】){0,}[\u4E00-\u9FA5一-龠ぁ-ゔァ-ヴー]{1,}([%。\/ \)\(）（\.,+：·【】，~-]{0,}|\d{0,}|[a-zA-Z]{0,}|[\u4E00-\u9FA5一-龠ぁ-ゔァ-ヴー、。]{0,}){0,}/gimu;

  const { file: fileWithoutMarks, marks } = replaceAllColorMarks(file);

  const matched = Array.from(
    new Set(fileWithoutMarks?.match(newRegExp)?.map((item) => item.trim()))
  );

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
