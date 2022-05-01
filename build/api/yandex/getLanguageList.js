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
exports.getLanguageList = void 0;
const yandexRequest_1 = require("./yandexRequest");
const getLanguageList = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, yandexRequest_1.yandexRequest)("https://translate.api.cloud.yandex.net/translate/v2/languages");
    if (!result)
        return null;
    return result.languages;
});
exports.getLanguageList = getLanguageList;
