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
exports.addToReports = void 0;
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const addToReports = (message) => __awaiter(void 0, void 0, void 0, function* () {
    let str = "";
    const key = kies_1.redisKey.struct(kies_1.groupsKey.reportLog, []);
    const logs = (yield redis_1.redis.get(key)) || [];
    try {
        str = JSON.stringify(message);
    }
    catch (error) {
        str = String(message);
    }
    if (logs.length > 1000) {
        logs.shift();
    }
    logs.push(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] ${str}`);
    yield redis_1.redis.set(key, logs);
});
exports.addToReports = addToReports;
