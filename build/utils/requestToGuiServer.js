"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogsForKeyWords = exports.sendCommand = exports.getChatLogs = exports.getChatRows = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_json_1 = require("../auth.json");
const log_1 = require("./log");
const sleep_1 = require("./sleep");
const botUrl = `http://${auth_json_1.ghost.host}:${auth_json_1.ghost.port}`;
const chatLogs = `${botUrl}/chat?pass=${auth_json_1.ghost.password}`;
const chatRowsCount = `${botUrl}/checkchat`;
const commandUrl = (command) => `${botUrl}/cmd?pass=${auth_json_1.ghost.password}&cmd=${escape(command)}`;
const getChatRows = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(chatRowsCount);
        return result.data;
    }
    catch (error) {
        return null;
    }
});
exports.getChatRows = getChatRows;
const getChatLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(chatLogs);
        const logs = result.data
            .toString()
            .replace(/&nbsp;/g, " ")
            .replace(/\[ {8}/g, "[")
            .split("<br>");
        logs.pop();
        return logs;
    }
    catch (error) {
        return null;
    }
});
exports.getChatLogs = getChatLogs;
const sendCommand = (command) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(commandUrl(command));
        return true;
    }
    catch (error) {
        return null;
    }
});
exports.sendCommand = sendCommand;
const checkLogsForKeyWords = (pattern, rows, interval, abortTimeout = 5000) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let timeout = abortTimeout;
        while (timeout > 0) {
            const currRows = yield exports.getChatRows();
            if (currRows !== rows) {
                const logs = (yield exports.getChatLogs()).slice(-Math.abs(rows - currRows));
                const patternSuccess = logs.reduce((arr, row) => {
                    if (row.match(pattern))
                        return [...arr, row];
                    return [...arr];
                }, []);
                if (patternSuccess.length)
                    return patternSuccess[0];
            }
            timeout -= interval;
            yield sleep_1.sleep(interval);
        }
        return false;
    }
    catch (error) {
        log_1.log(error);
        return null;
    }
});
exports.checkLogsForKeyWords = checkLogsForKeyWords;
