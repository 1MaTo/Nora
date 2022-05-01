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
exports.getTextChannel = void 0;
const bot_1 = require("../bot");
const log_1 = require("./log");
const getTextChannel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel = yield bot_1.client.channels.fetch(id, { force: true });
        if (!channel.isText())
            return null;
        return channel;
    }
    catch (error) {
        (0, log_1.log)(error);
        return null;
    }
});
exports.getTextChannel = getTextChannel;
