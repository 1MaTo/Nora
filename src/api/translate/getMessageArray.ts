export const getTemporarilyReplacedFileKey = (str: any) => {
  return `[NORA_T_ITEM]${str}[/NORA_T_ITEM]`;
};

export const getTemporarilyReplacedColorMarkKey = (str: any) => {
  return `|[NORA_COLOR_MARK_${str}]|`;
};

export const replaceAllColorMarks = (file: string) => {
  const colorMarkRegExp = /(\|\w[A-Za-z\d]{8})/gmu;
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

export const getMessageArray = (
  file: string,
  isCodeFile: boolean
): DataToTranslate => {
  const stringFileRegExp =
    /([^ =,\|$】：nr]{0,}[\u4E00-\u9FA5]{1,}[^\|,\n\(]{0,}){1,}/gimu;
  const codeFileRegExp =
    /(?!丨)[^\n,」，「）：丨|\(\)\|=a-zA-Z"0-9]*[\u4E00-\u9FA5]{1,}[^\(\)丨"\|\n\\a-z：（A-Z]*/gimu;
  const commentBlockRegExp = /^\/\//gim;

  const { file: fileWithoutMarks } = replaceAllColorMarks(file);

  const matched = Array.from(
    new Set(
      fileWithoutMarks
        ?.match(isCodeFile ? codeFileRegExp : stringFileRegExp)
        ?.map((item) => item.trim())
        ?.filter((item) => (isCodeFile ? !commentBlockRegExp.test(item) : true))
    )
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
