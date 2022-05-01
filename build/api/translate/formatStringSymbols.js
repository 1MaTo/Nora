"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatStringSymbols = void 0;
const formatStringSymbols = (str) => {
    return str
        .replace(/, */gm, "，")
        .replace(/\. */gm, "。")
        .replace(/: */gm, "：")
        .replace(/\) */gm, "）")
        .replace(/ *\(/gm, "（")
        .replace(/ *\[/gm, "【")
        .replace(/\] */gm, "】")
        .replace(/ *【/gm, "【")
        .replace(/】 */gm, "】");
};
exports.formatStringSymbols = formatStringSymbols;
