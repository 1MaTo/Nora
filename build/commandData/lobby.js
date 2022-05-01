"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lobbyCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.lobbyCommand = new builders_1.SlashCommandBuilder()
    .setName("lobby")
    .setDescription("Checking for lobbies in real time (only one instance per server)")
    .addSubcommand((command) => command
    .setName("start")
    .setDescription("start lobby watcher")
    .addChannelOption((option) => option
    .setName("channel")
    .setDescription("channel to send messages")
    .setRequired(false))
    .addIntegerOption((option) => option
    .setName("delay")
    .setDescription("updatind interval")
    .setRequired(false)
    .addChoice("1 second", 1000)
    .addChoice("2 seconds", 2000)
    .addChoice("3 seconds", 3000)
    .addChoice("4 seconds", 4000)
    .addChoice("5 seconds", 5000))
    .addBooleanOption((option) => option
    .setName("check")
    .setDescription("check all bots in database")
    .setRequired(false)))
    .addSubcommand((command) => command.setName("stop").setDescription("stop lobby watcher"));
exports.default = exports.lobbyCommand;
module.exports = exports.lobbyCommand;
