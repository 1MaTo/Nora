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
exports.getIAMToken = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_json_1 = require("../../auth.json");
const kies_1 = require("../../redis/kies");
const redis_1 = require("../../redis/redis");
const log_1 = require("../../utils/log");
const getIAMToken = (force) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = kies_1.redisKey.struct(kies_1.groupsKey.yandexIAMToken, ["NORA_TOKEN"]);
        const oldKey = yield redis_1.redis.get(key);
        if (oldKey && !force) {
            const isExpiredSoon = Math.floor((oldKey.expiresAt - Date.now()) / (1000 * 60 * 60)) <= 3;
            if (!isExpiredSoon) {
                (0, log_1.log)("[get IAM token] return cached key");
                return oldKey.iamToken;
            }
        }
        const result = yield axios_1.default.post("https://iam.api.cloud.yandex.net/iam/v1/tokens", { yandexPassportOauthToken: auth_json_1.yandesOAuth });
        if (!(result === null || result === void 0 ? void 0 : result.data))
            return null;
        const { iamToken, expiresAt } = result.data;
        yield redis_1.redis.set(key, {
            iamToken,
            expiresAt: Date.parse(new Date(expiresAt).toString()),
        });
        (0, log_1.log)("[get IAM token] return new api key");
        return iamToken;
    }
    catch (error) {
        (0, log_1.log)("[get IAM token] failed to get");
        return null;
    }
});
exports.getIAMToken = getIAMToken;
