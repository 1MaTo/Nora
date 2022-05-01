"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamestatsCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.gamestatsCommand = new builders_1.SlashCommandBuilder()
    .setName("gamestats")
    .setDescription("Stats collecting after game")
    .addSubcommand((command) => command
    .setName("start")
    .setDescription("start collecting stats")
    .addChannelOption((option) => option.setName("channel").setDescription("channel to send messages")))
    .addSubcommand((command) => command.setName("stop").setDescription("stop collecting stats"));
exports.default = exports.gamestatsCommand;
module.exports = exports.gamestatsCommand;
