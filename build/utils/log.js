"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const globals_1 = require("./globals");
const log = (...message) => {
    if (!globals_1.production)
        console.log(...message);
};
exports.log = log;
