"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.reportCommand = new builders_1.SlashCommandBuilder()
    .setName("report")
    .setDescription("report logs to owner");
exports.default = exports.reportCommand;
module.exports = exports.reportCommand;
