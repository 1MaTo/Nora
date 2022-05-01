"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatStringWords = void 0;
const formatStringWords = (str) => {
    return str
        .replace(/skill type/gim, "type")
        .replace(/cooling time/gim, "cd")
        .replace(/damage/gim, "dmg")
        .replace(/casting distance/gim, "range")
        .replace(/seconds/gim, "s");
};
exports.formatStringWords = formatStringWords;
