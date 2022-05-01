"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.logsCommand = new builders_1.SlashCommandBuilder()
    .setName("logs")
    .setDescription("Get command logs for last commands used")
    .addStringOption((option) => option
    .setName("query")
    .setDescription("some string to filter logs")
    .setRequired(false));
exports.default = exports.logsCommand;
module.exports = exports.logsCommand;
