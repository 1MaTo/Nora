"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageArray = exports.returnAllColorMarks = exports.replaceAllColorMarks = exports.getTemporarilyReplacedColorMarkKey = exports.getTemporarilyReplacedFileKey = void 0;
const getTemporarilyReplacedFileKey = (str) => {
    return `[NORA_T_ITEM]${str}[/NORA_T_ITEM]`;
};
exports.getTemporarilyReplacedFileKey = getTemporarilyReplacedFileKey;
const getTemporarilyReplacedColorMarkKey = (str) => {
    return `|[NORA_COLOR_MARK_${str}]|`;
};
exports.getTemporarilyReplacedColorMarkKey = getTemporarilyReplacedColorMarkKey;
const replaceAllColorMarks = (file) => {
    const colorMarkRegExp = /(\|\w[A-Za-z\d]{8})/gmu;
    const allMarks = Array.from(new Set(file.match(colorMarkRegExp)));
    if (allMarks.length === 0)
        return { file, marks: [] };
    return allMarks.reduce(({ file, marks }, mark, index) => {
        const markKey = (0, exports.getTemporarilyReplacedColorMarkKey)(index);
        const newStr = file.replaceAll(mark, markKey);
        return { file: newStr, marks: [...marks, { value: mark, key: markKey }] };
    }, { file, marks: [] });
};
exports.replaceAllColorMarks = replaceAllColorMarks;
const returnAllColorMarks = ({ file, marks, }) => {
    return marks.reduce((str, mark) => {
        return str.replaceAll(mark.key, mark.value);
    }, file);
};
exports.returnAllColorMarks = returnAllColorMarks;
const getMessageArray = (file, isCodeFile) => {
    var _a, _b;
    const stringFileRegExp = /([^ =,\|$】：nr]{0,}[\u4E00-\u9FA5]{1,}[^\|,\n\(]{0,}){1,}/gimu;
    const codeFileRegExp = /(?!丨)[^\n,」，「）：丨|\(\)\|=a-zA-Z"0-9]*[\u4E00-\u9FA5]{1,}[^\(\)丨"\|\n\\a-z：（A-Z]*/gimu;
    const commentBlockRegExp = /^\/\//gim;
    const { file: fileWithoutMarks } = (0, exports.replaceAllColorMarks)(file);
    const matched = Array.from(new Set((_b = (_a = fileWithoutMarks === null || fileWithoutMarks === void 0 ? void 0 : fileWithoutMarks.match(isCodeFile ? codeFileRegExp : stringFileRegExp)) === null || _a === void 0 ? void 0 : _a.map((item) => item.trim())) === null || _b === void 0 ? void 0 : _b.filter((item) => (isCodeFile ? !commentBlockRegExp.test(item) : true))));
    if (matched.length === 0)
        return null;
    matched.sort((a, b) => b.length - a.length);
    const data = matched.reduce((translateData, item, index) => {
        const key = (0, exports.getTemporarilyReplacedFileKey)(index);
        translateData.str = translateData.str.replaceAll(item, key);
        translateData.itemList.push([key, item]);
        return translateData;
    }, { str: file, itemList: [] });
    return data;
};
exports.getMessageArray = getMessageArray;
