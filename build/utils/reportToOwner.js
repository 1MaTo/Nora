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
exports.report = void 0;
const bot_1 = require("../bot");
const globals_1 = require("./globals");
const log_1 = require("./log");
const report = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const owner = yield bot_1.client.users.fetch(globals_1.ownerID, { cache: false });
        owner.send(`**REPORT**\n\`\`\`${message}\`\`\``);
    }
    catch (error) {
        (0, log_1.log)("[REPORT TO USER ERROR] ----> ", error);
    }
});
exports.report = report;
