"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.translateCommand = new builders_1.SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate file")
    .addStringOption((option) => option
    .setName("target")
    .setDescription("Result language")
    .setRequired(true)
    .addChoices([
    ["English", "en"],
    ["Russian", "ru"],
]))
    .addStringOption((option) => option
    .setName("message")
    .setDescription("Link to the discord message with attached .txt file")
    .setRequired(false))
    .addStringOption((option) => option
    .setName("one_drive")
    .setDescription("Link to the google one drive file")
    .setRequired(false))
    .addBooleanOption((option) => option
    .setName("code_file")
    .setDescription("use code sensitive reg exp")
    .setRequired(false));
exports.default = exports.translateCommand;
module.exports = exports.translateCommand;
