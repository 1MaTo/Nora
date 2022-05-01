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
const getGoogeDriveFileName_1 = require("../api/googleDrive/getGoogeDriveFileName");
const auth_json_1 = require("../auth.json");
const upload_1 = __importDefault(require("../commandData/upload"));
const response_1 = require("../embeds/response");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const discordMessage_1 = require("../utils/discordMessage");
const downloadFile_1 = require("../utils/downloadFile");
const globals_1 = require("../utils/globals");
const requestToGuiServer_1 = require("../utils/requestToGuiServer");
module.exports = {
    data: upload_1.default,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && interaction.member.user.id !== globals_1.ownerID)
                return;
            yield interaction.deferReply();
            const key = kies_1.redisKey.struct(kies_1.groupsKey.uploadingMap, [interaction.guildId]);
            const userUploading = yield redis_1.redis.get(key);
            if (userUploading) {
                return yield (0, discordMessage_1.editReply)(interaction, {
                    embeds: [
                        (0, response_1.warning)(`${userUploading} already uploading map, wait until it's done`),
                    ],
                }, globals_1.msgDeleteTimeout.short);
            }
            let mapLink = interaction.options.getString("link");
            let fileName = interaction.options.getString("file_name");
            let configName = interaction.options.getString("config_name") ||
                (fileName && fileName.replace(/\.w3x$/g, ""));
            if (fileName && !/.w3x$/.test(fileName)) {
                fileName = fileName + ".w3x";
            }
            const isGoogleDriveLink = new RegExp("https://drive.google.com/file/d/", "i").test(mapLink);
            const isSourceLink = /[^\/]*.w3x$/.test(mapLink);
            if (!isGoogleDriveLink && !isSourceLink)
                return yield (0, discordMessage_1.editReply)(interaction, {
                    embeds: [
                        (0, response_1.warning)(`Link must be \ngoogle drive link (drive.google.com/file/d/...)\nor\nsource link (ends like this - .../mapName.w3x)`),
                    ],
                }, globals_1.msgDeleteTimeout.long);
            if (isGoogleDriveLink) {
                const validMatches = mapLink.match(/d\/[^\/]*\/*/g);
                if (!validMatches) {
                    return yield (0, discordMessage_1.editReply)(interaction, {
                        embeds: [(0, response_1.warning)(`Can't read this link`)],
                    }, globals_1.msgDeleteTimeout.long);
                }
                const docId = validMatches[0].replace(/(d\/|\/)/g, "");
                const googleDriveName = yield (0, getGoogeDriveFileName_1.getGoogeDriveFileName)(`https://www.googleapis.com/drive/v3/files/${docId}?&key=${auth_json_1.googleDriveApiKey}`);
                if (googleDriveName && !/.w3x$/.test(googleDriveName)) {
                    return yield (0, discordMessage_1.editReply)(interaction, {
                        embeds: [(0, response_1.warning)(`This file has not .w3x extension`)],
                    }, globals_1.msgDeleteTimeout.short);
                }
                fileName = fileName || googleDriveName || "uknown_map";
                mapLink = `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=${auth_json_1.googleDriveApiKey}`;
            }
            if (isSourceLink) {
                const fileNameFromLink = mapLink.match(/[^\/]*.w3x$/);
                fileName =
                    fileName || fileNameFromLink ? fileNameFromLink[0] : "uknown_map";
            }
            configName = configName || fileName.replace(/\.w3x$/g, "");
            yield redis_1.redis.set(key, interaction.user.tag);
            const fileDownloaded = yield (0, downloadFile_1.downloadFile)(mapLink, fileName.replace(/\.w3x$/g, ""));
            if (!fileDownloaded) {
                yield redis_1.redis.del(key);
                return yield (0, discordMessage_1.editReply)(interaction, {
                    embeds: [(0, response_1.error)(`Cant download file from link`)],
                }, globals_1.msgDeleteTimeout.short);
            }
            const fileUploaded = yield (0, requestToGuiServer_1.uploadMapToGhost)(configName.replace(/\.w3x$/g, ""), fileName);
            if (!fileUploaded) {
                yield redis_1.redis.del(key);
                return yield (0, discordMessage_1.editReply)(interaction, {
                    embeds: [(0, response_1.error)(`Cant upload file to ghost`)],
                }, globals_1.msgDeleteTimeout.short);
            }
            yield redis_1.redis.del(key);
            return yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [
                    (0, response_1.success)(`Map "${fileName}" with config "${configName}" uploaded`),
                ],
            }, globals_1.msgDeleteTimeout.short);
        });
    },
};
