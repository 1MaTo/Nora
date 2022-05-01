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
exports.getArrayTotalLength = exports.getTranslationRequestGroups = exports.translateGroup = exports.translateAllItems = void 0;
const log_1 = require("../../utils/log");
const sleep_1 = require("../../utils/sleep");
const translateYandex_1 = require("../yandex/translateYandex");
const glossary_1 = require("./glossary");
const maxLengthPerRequest = 10000;
const maxRequestPerSecond = 20;
const translateAllItems = (data, target) => __awaiter(void 0, void 0, void 0, function* () {
    const translationGroups = (0, exports.getTranslationRequestGroups)(data.itemList);
    const results = [];
    while (translationGroups.length > 0) {
        const requestGroups = translationGroups.splice(0, maxRequestPerSecond);
        const groupTranslateResult = yield Promise.all(requestGroups.map((group) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.translateGroup)(group, target); })));
        results.push(groupTranslateResult.flat());
        yield (0, sleep_1.sleep)(1000);
    }
    return results.flat();
});
exports.translateAllItems = translateAllItems;
const translateGroup = (textGroup, target) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawResult = yield (0, translateYandex_1.translateYandex)({
            texts: textGroup,
            sourceLanguageCode: "zh",
            targetLanguageCode: target,
            glossaryConfig: {
                glossaryData: {
                    glossaryPairs: glossary_1.glossary,
                },
            },
        });
        if (!rawResult)
            return [];
        return rawResult.translations.map((item) => item.text);
    }
    catch (error) {
        (0, log_1.log)("[translating groups] error when translating group");
        return [];
    }
});
exports.translateGroup = translateGroup;
const getTranslationRequestGroups = (text) => {
    const messageGroups = text.reduce((data, item, index) => {
        const [_, value] = item;
        const curerntLength = (0, exports.getArrayTotalLength)(data.currentGroup) + value.length;
        if (curerntLength >= maxLengthPerRequest) {
            data.groups.push(data.currentGroup);
            data.currentGroup = [];
        }
        const isLastItem = index + 1 === text.length;
        if (isLastItem) {
            data.groups.push([...data.currentGroup, value]);
            data.currentGroup = [];
            return data;
        }
        data.currentGroup.push(value);
        return data;
    }, {
        groups: [],
        currentGroup: [],
    });
    return messageGroups.groups;
};
exports.getTranslationRequestGroups = getTranslationRequestGroups;
const getArrayTotalLength = (arr) => {
    return arr.reduce((totalLength, item) => totalLength + item.length, 0);
};
exports.getArrayTotalLength = getArrayTotalLength;
