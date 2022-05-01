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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportFileData = void 0;
const kies_1 = require("../../../redis/kies");
const redis_1 = require("../../../redis/redis");
const zipString_1 = require("../../zip/zipString");
const generateReportFileData = () => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.reportLog, []);
    const logs = (yield redis_1.redis.get(key)) || [];
    const stringData = logs.join("\n");
    let data = Buffer.from(stringData, "utf-8");
    let fileName = "report.txt";
    if (data.length > 8283750) {
        data = Buffer.from(yield (0, zipString_1.zipString)(fileName, stringData));
        fileName.replace(".txt", ".zip");
    }
    return { file: data, fileName: fileName };
});
exports.generateReportFileData = generateReportFileData;
