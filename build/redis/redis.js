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
const client = redis_1.createClient(auth_json_1.redisConnection);
client.on("error", (error) => {
    log_1.log(error);
});
client.on("reconnecting", () => { });
const getObj = util_1.promisify(client.get).bind(client);
const setObj = util_1.promisify(client.set).bind(client);
const mgetObj = util_1.promisify(client.mget).bind(client);
const scan = util_1.promisify(client.scan).bind(client);
exports.redis = {
    get: (key) => __awaiter(void 0, void 0, void 0, function* () { return JSON.parse(yield getObj(key)); }),
    set: (key, data) => __awaiter(void 0, void 0, void 0, function* () { return yield setObj(key, JSON.stringify(data)); }),
    mget: (kies) => __awaiter(void 0, void 0, void 0, function* () { return (yield mgetObj(kies)).map((object) => JSON.parse(object)); }),
    del: util_1.promisify(client.del).bind(client),
    exist: util_1.promisify(client.exists).bind(client),
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
