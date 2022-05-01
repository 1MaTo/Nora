"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ghostCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.ghostCommand = new builders_1.SlashCommandBuilder()
    .setName("ghost")
    .setDescription("Send command to ghost")
    .addSubcommand((subcommand) => subcommand
    .setName("pub")
    .setDescription("host game")
    .addStringOption((option) => option.setName("gamename").setDescription("Game name").setRequired(true)))
    .addSubcommand((subcommand) => subcommand.setName("unhost").setDescription("Unhost game in lobby"))
    .addSubcommand((subcommand) => subcommand.setName("start").setDescription("Start game in lobby"))
    .addSubcommand((subcommand) => subcommand
    .setName("load-map")
    .setDescription("Create config and load it")
    .addStringOption((option) => option.setName("map").setDescription("Map name").setRequired(true)))
    .addSubcommand((subcommand) => subcommand
    .setName("select-map")
    .setDescription("Select config from list and load it"));
exports.default = exports.ghostCommand;
module.exports = exports.ghostCommand;
