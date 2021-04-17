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
exports.getMessageById = exports.sendResponse = void 0;
const discordChannel_1 = require("./discordChannel");
const log_1 = require("./log");
const sendResponse = (channelID, content, deleteTimeOut = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel = yield discordChannel_1.getTextChannel(channelID);
        const message = yield channel.send(content);
        if (deleteTimeOut)
            message.delete({ timeout: deleteTimeOut });
        return message;
    }
    catch (error) {
        log_1.log(error);
        return null;
    }
});
exports.sendResponse = sendResponse;
const getMessageById = (messageID, channelID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel = yield discordChannel_1.getTextChannel(channelID);
        const message = yield channel.messages.fetch(messageID, true);
        return message;
    }
    catch (error) {
        log_1.log(error);
        return null;
    }
});
exports.getMessageById = getMessageById;
