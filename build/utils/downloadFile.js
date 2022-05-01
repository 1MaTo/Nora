"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.clearMapUploadsFolder = exports.downloadFile = exports.uploadsMapFolder = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const stream = __importStar(require("stream"));
const util_1 = require("util");
const log_1 = require("./log");
const fs_extra_1 = __importDefault(require("fs-extra"));
const formatBytes_1 = require("./formatBytes");
const finished = (0, util_1.promisify)(stream.finished);
exports.uploadsMapFolder = __dirname + "/../../../uploads";
const max_size = 1073741824;
const checkSize = (link) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, axios_1.default)({
        method: "HEAD",
        url: link,
    });
    const length = parseInt(result.headers["content-length"]);
    (0, log_1.log)("[check file size] " + (0, formatBytes_1.formatBytes)(length));
    return length < max_size;
});
const downloadFile = (link, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAcceptSize = yield checkSize(link);
        if (!isAcceptSize)
            return false;
        const result = yield (0, axios_1.default)({
            method: "GET",
            responseType: "stream",
            url: link,
        });
        const writer = (0, fs_1.createWriteStream)(`${exports.uploadsMapFolder}/${fileName}.w3x`);
        result.data.pipe(writer);
        yield finished(writer);
        return true;
    }
    catch (err) {
        (0, log_1.log)("[download file] error when dowloading", err);
        yield (0, exports.clearMapUploadsFolder)(exports.uploadsMapFolder);
        return false;
    }
});
exports.downloadFile = downloadFile;
const clearMapUploadsFolder = (pathToFolder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_extra_1.default.emptyDir(pathToFolder);
    }
    catch (err) {
        (0, log_1.log)("[delete files in folder] error when deleting", err);
        return false;
    }
    return true;
});
exports.clearMapUploadsFolder = clearMapUploadsFolder;
