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
exports.yandexRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_json_1 = require("../../auth.json");
const log_1 = require("../../utils/log");
const getIAMToken_1 = require("./getIAMToken");
const yandexRequest = (url, requestData = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, getIAMToken_1.getIAMToken)();
    if (!token) {
        (0, log_1.log)("[yandex request] cant get IAM token");
        return null;
    }
    try {
        const result = yield axios_1.default.post(url, Object.assign(Object.assign({}, requestData), { folderId: auth_json_1.yandexCatalogId }), { headers: { Authorization: `Bearer ${token}` } });
        if (!(result === null || result === void 0 ? void 0 : result.data))
            return null;
        return result.data;
    }
    catch (error) {
        (0, log_1.log)("[translate yandex] cant get request " + error.statusCode);
        return null;
    }
});
exports.yandexRequest = yandexRequest;
