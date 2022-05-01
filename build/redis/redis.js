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
exports.redis = void 0;
const redis_1 = require("redis");
const util_1 = require("util");
const auth_json_1 = require("../auth.json");
const log_1 = require("../utils/log");
const client = (0, redis_1.createClient)(auth_json_1.redisConnection);
client.on("error", (error) => {
    (0, log_1.log)(error);
});
client.on("reconnecting", () => { });
const getObj = (0, util_1.promisify)(client.get).bind(client);
const setObj = (0, util_1.promisify)(client.set).bind(client);
const mgetObj = (0, util_1.promisify)(client.mget).bind(client);
const scan = (0, util_1.promisify)(client.scan).bind(client);
const delObj = (0, util_1.promisify)(client.del).bind(client);
exports.redis = {
    get: (key) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return JSON.parse(yield getObj(key));
        }
        catch (error) {
            (0, log_1.log)("[redis] cant get item");
            return undefined;
        }
    }),
    set: (key, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield setObj(key, JSON.stringify(data));
        }
        catch (error) {
            (0, log_1.log)("[redis] cant set item");
            return undefined;
        }
    }),
    mget: (kies) => __awaiter(void 0, void 0, void 0, function* () { return (yield mgetObj(kies)).map((object) => JSON.parse(object)); }),
    del: (key) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield delObj(key);
        }
        catch (error) {
            (0, log_1.log)("[redis] cant delete item");
            return undefined;
        }
    }),
    exist: (0, util_1.promisify)(client.exists).bind(client),
    scanForPattern: (pattern) => __awaiter(void 0, void 0, void 0, function* () {
        let cursor = "0";
        const found = [];
        do {
            const reply = yield scan(cursor, "MATCH", pattern);
            cursor = reply[0];
            found.push(...reply[1]);
        } while (cursor !== "0");
        return found.length ? found : null;
    }),
};
