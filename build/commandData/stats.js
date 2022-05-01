"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.statsCommand = new builders_1.SlashCommandBuilder()
    .setName("stats")
    .setDescription("Statistic")
    .addSubcommand((command) => command
    .setName("totalgames")
    .setDescription("Show all games you played on bot with sorting by maps")
    .addStringOption((option) => option
    .setName("nickname")
    .setDescription("Nickname to check, leave empty to check your binded nickname")
    .setRequired(false)))
    .addSubcommand((command) => command
    .setName("winrate")
    .setDescription("Show your winrate statistic")
    .addStringOption((option) => option
    .setName("nickname")
    .setDescription("Nickname to check, leave empty to check your binded nickname")
    .setRequired(false)))
    .addSubcommand((command) => command.setName("damage").setDescription("Leaderboard by damage"));
exports.default = exports.statsCommand;
module.exports = exports.statsCommand;
