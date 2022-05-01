"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatStringQuotes = void 0;
const formatStringQuotes = (str) => {
    return str
        .replace(/[“”]/gm, `"`)
        .replace(/([^"]*"[^"]*)"/gm, "$1」")
        .replace(/"/gm, "「");
};
exports.formatStringQuotes = formatStringQuotes;
