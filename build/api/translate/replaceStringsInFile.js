"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceStringsInFile = void 0;
const formatStringQuotes_1 = require("./formatStringQuotes");
const formatStringSymbols_1 = require("./formatStringSymbols");
const formatStringWords_1 = require("./formatStringWords");
const getMessageArray_1 = require("./getMessageArray");
const replaceStringsInFile = (fileDataWithKeys, translatedString, skipReplace, isCodeFile) => {
    const replacedWithTranslationString = translatedString.reduce((translatedData, str, index) => {
        const replacedWords = (0, formatStringWords_1.formatStringWords)(str);
        const replacedSymbols = skipReplace
            ? replacedWords
            : (0, formatStringSymbols_1.formatStringSymbols)(replacedWords);
        const replaceQuotes = isCodeFile
            ? (0, formatStringQuotes_1.formatStringQuotes)(replacedSymbols)
            : replacedSymbols;
        return translatedData.replaceAll((0, getMessageArray_1.getTemporarilyReplacedFileKey)(index), replaceQuotes);
    }, fileDataWithKeys);
    return replacedWithTranslationString;
};
exports.replaceStringsInFile = replaceStringsInFile;
