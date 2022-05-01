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
exports.getConfigListFromGhost = exports.uploadMapToGhost = exports.checkLogsForKeyWords = exports.whaitForCommandResult = exports.getCurrentGamesCount = exports.sendCommand = exports.getChatLogs = exports.getChatRows = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const node_fs_1 = __importDefault(require("node:fs"));
const auth_json_1 = require("../auth.json");
const downloadFile_1 = require("./downloadFile");
const globals_1 = require("./globals");
const log_1 = require("./log");
const sleep_1 = require("./sleep");
const botUrl = process.env.BOT_ID === "228"
    ? `http://127.0.0.1:3000`
    : `http://${auth_json_1.ghost.host}:${auth_json_1.ghost.port}`;
const chatLogs = `${botUrl}/chat?pass=${auth_json_1.ghost.password}`;
const chatRowsCount = `${botUrl}/checkchat`;
const commandUrl = (command) => `${botUrl}/cmd?pass=${auth_json_1.ghost.password}&cmd=${escape(command)}`;
const getChatRows = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(chatRowsCount, { timeout: 1000 });
        return result.data;
    }
    catch (error) {
        return null;
    }
});
exports.getChatRows = getChatRows;
const getChatLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(chatLogs, { timeout: globals_1.ghostApiTimeout });
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
const sendCommand = (command, delayEndMark) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startMark = `nora start command mark ${Date.now()}`;
        const endMark = `nora end command mark ${Date.now()}`;
        yield axios_1.default.get(commandUrl(startMark), {
            timeout: globals_1.ghostApiTimeout,
        });
        yield axios_1.default.get(commandUrl(command), {
            timeout: globals_1.ghostApiTimeout,
        });
        delayEndMark && (yield (0, sleep_1.sleep)(delayEndMark));
        yield axios_1.default.get(commandUrl(endMark), {
            timeout: globals_1.ghostApiTimeout,
        });
        return [startMark, endMark];
    }
    catch (error) {
        return null;
    }
});
exports.sendCommand = sendCommand;
const getCurrentGamesCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(`${botUrl}/INFO`, {
            timeout: globals_1.ghostApiTimeout,
        });
        const matched = result.data.match(/current Games: \d{1,}/gi);
        if (!matched)
            return 0;
        const number = parseInt(matched[0].replace(/[^\d]/g, ""));
        if (isNaN(number))
            return 0;
        return number;
    }
    catch (error) {
        return 0;
    }
});
exports.getCurrentGamesCount = getCurrentGamesCount;
const whaitForCommandResult = ({ startMark, endMark, successMark, errorMark, }) => __awaiter(void 0, void 0, void 0, function* () {
    let commandStartMarkExist = false;
    let commandEndMarkExist = false;
    let commandSuccessMarkExist = false;
    let timeOut = false;
    let requestError = false;
    let logs = [];
    const timeStart = Date.now();
    while (!commandStartMarkExist || !commandEndMarkExist) {
        if (Date.now() - timeStart > 1000 * 5) {
            timeOut = true;
            break;
        }
        try {
            const newLogs = (yield (0, exports.getChatLogs)()) || [];
            logs = [...logs, ...newLogs];
        }
        catch (err) {
            requestError = true;
            (0, log_1.log)("[getting ghost command logs] error when getting", err);
            break;
        }
        commandSuccessMarkExist = logs.some((log) => successMark.test(log));
        commandStartMarkExist = logs.some((log) => log.includes(startMark));
        commandEndMarkExist = logs.some((log) => log.includes(endMark));
        yield (0, sleep_1.sleep)(200);
    }
    if (timeOut && commandSuccessMarkExist)
        return "success";
    if (timeOut)
        return "timeout";
    if (requestError)
        return null;
    logs = Array.from(new Set(logs));
    if (logs.some((row) => successMark.test(row))) {
        return "success";
    }
    if (errorMark && logs.some((row) => errorMark.test(row))) {
        return "error";
    }
    return "uknown";
});
exports.whaitForCommandResult = whaitForCommandResult;
const checkLogsForKeyWords = (pattern, rows, interval, abortTimeout = 5000) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let timeout = abortTimeout;
        while (timeout > 0) {
            const currRows = yield (0, exports.getChatRows)();
            if (currRows !== rows) {
                const rawLogs = yield (0, exports.getChatLogs)();
                if (!rawLogs) {
                    timeout -= interval;
                    yield (0, sleep_1.sleep)(interval);
                    return;
                }
                const logs = rawLogs.slice(-Math.abs(rows - currRows));
                const patternSuccess = logs.reduce((arr, row) => {
                    if (row.match(pattern))
                        return [...arr, row];
                    return [...arr];
                }, []);
                if (patternSuccess.length)
                    return patternSuccess[0];
            }
            timeout -= interval;
            yield (0, sleep_1.sleep)(interval);
        }
        return false;
    }
    catch (error) {
        (0, log_1.log)(error);
        return null;
    }
});
exports.checkLogsForKeyWords = checkLogsForKeyWords;
const uploadMapToGhost = (configName, mapName) => __awaiter(void 0, void 0, void 0, function* () {
    const form = new form_data_1.default();
    form.append("textline", configName);
    form.append("datafile", node_fs_1.default.createReadStream(`${downloadFile_1.uploadsMapFolder}/${mapName}`));
    try {
        const submitForm = (form) => {
            return new Promise((resolve, reject) => {
                form.submit(`${botUrl}/UPLOAD`, (err, res) => __awaiter(void 0, void 0, void 0, function* () {
                    res.resume();
                    if (res.statusCode === 200)
                        resolve(res);
                    reject(err);
                }));
            });
        };
        yield submitForm(form);
        yield (0, downloadFile_1.clearMapUploadsFolder)(downloadFile_1.uploadsMapFolder);
        return true;
    }
    catch (err) {
        (0, log_1.log)("[upload map to bot] error when uploading map", err);
        yield (0, downloadFile_1.clearMapUploadsFolder)(downloadFile_1.uploadsMapFolder);
        return false;
    }
});
exports.uploadMapToGhost = uploadMapToGhost;
const getConfigListFromGhost = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(`${botUrl}/CFGS`, {
            timeout: globals_1.ghostApiTimeout,
        });
        const configs = result.data.match(/<th>(.*?)<\/th>/g);
        const cleanStrings = configs
            ? configs
                .map((item) => item.replace(/<th>|<\/th>/g, ""))
                .filter((item) => item)
            : [];
        return cleanStrings.length > 25
            ? cleanStrings.slice(configs.length - 25)
            : cleanStrings;
    }
    catch (error) {
        (0, log_1.log)("[getting config from ghost]", error);
        return false;
    }
});
exports.getConfigListFromGhost = getConfigListFromGhost;
