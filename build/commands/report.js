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
const discord_js_1 = require("discord.js");
const generateReportFileData_1 = require("../api/commands/report/generateReportFileData");
const report_1 = __importDefault(require("../commandData/report"));
const discordMessage_1 = require("../utils/discordMessage");
module.exports = {
    data: report_1.default,
    ownerOnly: true,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { file, fileName } = yield (0, generateReportFileData_1.generateReportFileData)();
            /* const user = await client.users.fetch(interaction.user.id); */
            yield interaction.user.send({
                files: [new discord_js_1.MessageAttachment(file, fileName)],
            });
            yield (0, discordMessage_1.sendReply)(interaction, { content: "complete", ephemeral: true });
        });
    },
};
