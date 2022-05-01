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
exports.getGoogleDriveLinkData = void 0;
const auth_json_1 = require("../../auth.json");
const getGoogeDriveFileName_1 = require("./getGoogeDriveFileName");
const getGoogleDriveLinkData = (link) => __awaiter(void 0, void 0, void 0, function* () {
    const isGoogleDriveLink = new RegExp("https://drive.google.com/file/d/", "i").test(link);
    if (!isGoogleDriveLink) {
        return null;
    }
    const docId = link.match(/d\/[^\/]*\//g)[0].replace(/(d\/|\/)/g, "");
    const googleDriveName = yield (0, getGoogeDriveFileName_1.getGoogeDriveFileName)(`https://www.googleapis.com/drive/v3/files/${docId}?&key=${auth_json_1.googleDriveApiKey}`);
    return {
        fileName: googleDriveName || null,
        fileUrl: `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=${auth_json_1.googleDriveApiKey}`,
    };
});
exports.getGoogleDriveLinkData = getGoogleDriveLinkData;
