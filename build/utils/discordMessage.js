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
exports.editMessage = exports.editMessageWithDelay = exports.deleteMessageWithDelay = exports.editReply = exports.sendReply = exports.getMessageById = exports.sendResponse = void 0;
const discordChannel_1 = require("./discordChannel");
const globals_1 = require("./globals");
const log_1 = require("./log");
const sendResponse = (channelID, content, deleteTimeOut = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel = yield (0, discordChannel_1.getTextChannel)(channelID);
        const message = yield channel.send(content);
        if (deleteTimeOut)
            setTimeout(() => message.delete(), deleteTimeOut);
        return message;
    }
    catch (error) {
        (0, log_1.log)(error);
        return null;
    }
});
exports.sendResponse = sendResponse;
const getMessageById = (messageID, channelID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel = yield (0, discordChannel_1.getTextChannel)(channelID);
        const message = yield channel.messages.fetch(messageID, { force: true });
        return message;
    }
    catch (error) {
        (0, log_1.log)("[get message by id] cant find this msg");
        return null;
    }
});
exports.getMessageById = getMessageById;
const sendReply = (interaction, content, delay) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield interaction.reply(content);
    delay &&
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield interaction.deleteReply();
            }
            catch (err) {
                (0, log_1.log)("[editReply] cant send message");
            }
        }), delay);
    return message;
});
exports.sendReply = sendReply;
const editReply = (interaction, content, delay) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield interaction.editReply(content);
    delay &&
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield interaction.deleteReply();
            }
            catch (err) {
                (0, log_1.log)("[editReply] cant delete message");
            }
        }), delay);
    return message;
});
exports.editReply = editReply;
const deleteMessageWithDelay = (message, delay = globals_1.msgDeleteTimeout.short) => __awaiter(void 0, void 0, void 0, function* () {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield message.delete();
        }
        catch (error) {
            (0, log_1.log)("[deleting message] cant delete message");
        }
    }), delay);
});
exports.deleteMessageWithDelay = deleteMessageWithDelay;
const editMessageWithDelay = (message, content, delay = globals_1.msgEditTimeout.short) => __awaiter(void 0, void 0, void 0, function* () {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield message.edit(content);
        }
        catch (error) {
            (0, log_1.log)("[editing message] cant edit message");
        }
    }), delay);
});
exports.editMessageWithDelay = editMessageWithDelay;
const editMessage = (message, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield message.edit(content);
    }
    catch (error) {
        (0, log_1.log)("[editing message] cant edit message");
        return null;
    }
});
exports.editMessage = editMessage;
