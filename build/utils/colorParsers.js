"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWinrateColor = exports.hslToHex = void 0;
const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};
exports.hslToHex = hslToHex;
const getWinrateColor = (value) => {
    var hue = Number(((value / 100) * 120).toString(10));
    return (0, exports.hslToHex)(hue, 100, 40);
};
exports.getWinrateColor = getWinrateColor;
