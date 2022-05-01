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
const getGoogleDriveLinkData_1 = require("../api/googleDrive/getGoogleDriveLinkData");
const fetchFile_1 = require("../api/translate/fetchFile");
const getMessageArray_1 = require("../api/translate/getMessageArray");
const replaceStringsInFile_1 = require("../api/translate/replaceStringsInFile");
const translateAllItems_1 = require("../api/translate/translateAllItems");
const zipString_1 = require("../api/zip/zipString");
const translate_1 = __importDefault(require("../commandData/translate"));
const response_1 = require("../embeds/response");
const discordMessage_1 = require("../utils/discordMessage");
const formatBytes_1 = require("../utils/formatBytes");
const globals_1 = require("../utils/globals");
const log_1 = require("../utils/log");
module.exports = {
    data: translate_1.default,
    ownerOnly: true,
    execute(interaction) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && interaction.member.user.id !== globals_1.ownerID)
                return;
            if (interaction.user.id !== globals_1.ownerID) {
                yield interaction.reply("Your are not my sempai!");
                return;
            }
            yield interaction.deferReply();
            let fileUrl = "";
            let fileName = "translated_file.txt";
            const fromMessage = (_a = interaction.options
                .getString("message")) === null || _a === void 0 ? void 0 : _a.match(/(\d{1,})/gim);
            const oneDriveLink = interaction.options.getString("one_drive");
            if (!fromMessage && !oneDriveLink) {
                yield (0, discordMessage_1.editReply)(interaction, {
                    embeds: [(0, response_1.error)("No links provided")],
                }, globals_1.msgDeleteTimeout.short);
                return;
            }
            if (fromMessage) {
                const [_, channelId, messageId] = fromMessage;
                const msg = yield (0, discordMessage_1.getMessageById)(messageId, channelId);
                if (!msg) {
                    yield (0, discordMessage_1.editReply)(interaction, {
                        embeds: [(0, response_1.error)("Can't find this msg")],
                    }, globals_1.msgDeleteTimeout.short);
                    return;
                }
                fileUrl = (_b = msg.attachments.first()) === null || _b === void 0 ? void 0 : _b.url;
                if (!fileUrl) {
                    yield (0, discordMessage_1.editReply)(interaction, {
                        embeds: [
                            (0, response_1.error)("Can't find attached file, it must be the first attachment is the message"),
                        ],
                    }, globals_1.msgDeleteTimeout.short);
                    return;
                }
                fileName = (_c = msg.attachments.first()) === null || _c === void 0 ? void 0 : _c.name;
            }
            if (oneDriveLink) {
                const data = yield (0, getGoogleDriveLinkData_1.getGoogleDriveLinkData)(oneDriveLink);
                if (!data) {
                    yield (0, discordMessage_1.editReply)(interaction, {
                        embeds: [(0, response_1.error)("Bad one drive link")],
                    }, globals_1.msgDeleteTimeout.short);
                    return;
                }
                fileName = data.fileName || fileName;
                fileUrl = data.fileUrl;
            }
            const file = yield (0, fetchFile_1.fetchFile)(fileUrl);
            if (!file) {
                yield (0, discordMessage_1.editReply)(interaction, {
                    embeds: [(0, response_1.error)("Can't get file data, network error")],
                }, globals_1.msgDeleteTimeout.short);
                return;
            }
            const messageArray = (0, getMessageArray_1.getMessageArray)(file, interaction.options.getBoolean("code_file"));
            //log(messageArray.itemList, messageArray.str);
            if (!messageArray) {
                yield (0, discordMessage_1.editReply)(interaction, {
                    embeds: [(0, response_1.error)("Nothing to translate")],
                }, globals_1.msgDeleteTimeout.short);
                return;
            }
            /* await interaction.editReply({
              content: fileName,
            });
        
            return; */
            const targetLang = interaction.options.getString("target");
            const translatedStrings = yield (0, translateAllItems_1.translateAllItems)(messageArray, targetLang);
            const translatedFileData = (0, replaceStringsInFile_1.replaceStringsInFile)(messageArray.str, translatedStrings, false, interaction.options.getBoolean("code_file"));
            let readyToSendFile = Buffer.from(translatedFileData, "utf-8");
            (0, log_1.log)("file length", (0, formatBytes_1.formatBytes)(readyToSendFile.length));
            //  More than 7.9 MB
            if (readyToSendFile.length > 8283750) {
                readyToSendFile = Buffer.from(yield (0, zipString_1.zipString)(fileName, translatedFileData));
                fileName = fileName.replace(".txt", ".zip");
                (0, log_1.log)("zip file length", (0, formatBytes_1.formatBytes)(readyToSendFile.length));
            }
            yield interaction.editReply({
                files: [new discord_js_1.MessageAttachment(readyToSendFile, fileName)],
            });
            return;
        });
    },
};
