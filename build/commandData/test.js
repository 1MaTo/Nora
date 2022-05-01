"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.testCommand = new builders_1.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");
exports.default = exports.testCommand;
module.exports = exports.testCommand;
