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
exports.getMember = void 0;
const discordGuild_1 = require("./discordGuild");
const log_1 = require("./log");
const getMember = (guildID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guild = yield discordGuild_1.getGuild(guildID);
        const user = guild.member(userID);
        return user;
    }
    catch (error) {
        log_1.log(error);
        return null;
    }
});
exports.getMember = getMember;
