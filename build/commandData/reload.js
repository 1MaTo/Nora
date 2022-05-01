"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadCommand = void 0;
const builders_1 = require("@discordjs/builders");
exports.reloadCommand = new builders_1.SlashCommandBuilder()
    .setName("reload")
    .setDescription("reload bot (OWNER COMMAND)")
    .addBooleanOption((option) => option
    .setName("update")
    .setDescription("Update before restart?")
    .setRequired(true));
exports.default = exports.reloadCommand;
module.exports = exports.reloadCommand;
