"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillSpaces = void 0;
const fillSpaces = (maxSymbols, str = "", symbolsCount = null, symbol = " ") => {
    return `${str}${[
        ...Array(symbolsCount || Math.abs(maxSymbols - str.length)).keys(),
    ]
        .map((_) => symbol)
        .join("")}`;
};
exports.fillSpaces = fillSpaces;
