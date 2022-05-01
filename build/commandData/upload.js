"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.uploadCommand = new builders_1.SlashCommandBuilder()
    .setName("upload")
    .setDescription("upload map to ghost (up to 1gb)")
    .addStringOption((option) => option
    .setName("link")
    .setDescription("link to map (google drive or source link only)")
    .setRequired(true))
    .addStringOption((option) => option
    .setName("file_name")
    .setDescription("override map file name")
    .setRequired(false))
    .addStringOption((option) => option
    .setName("config_name")
    .setDescription("config name for this map")
    .setRequired(false));
exports.default = exports.uploadCommand;
module.exports = exports.uploadCommand;
