"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const globals_1 = require("./globals");
const reports_1 = require("./reports");
const log = (...message) => {
    if (globals_1.production)
        (0, reports_1.addToReports)(message);
    if (!globals_1.production || globals_1.withLogs)
        console.log(...message);
};
exports.log = log;
