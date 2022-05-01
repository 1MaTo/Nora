"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = void 0;
const discord_js_1 = require("discord.js");
const bot_1 = require("../bot");
const node_fs_1 = __importDefault(require("node:fs"));
const slashCommandsFolder = "../commands";
const buttonsFolder = "../commands/buttons";
const selectMenusFolder = "../commands/selectMenus";
const loadCommands = () => {
    bot_1.client.commands = new discord_js_1.Collection();
    bot_1.client.buttons = new discord_js_1.Collection();
    bot_1.client.selectMenus = new discord_js_1.Collection();
    //  Slash command interactions
    const commandFiles = node_fs_1.default
        .readdirSync(__dirname + `/${slashCommandsFolder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./${slashCommandsFolder}/${file}`);
        bot_1.client.commands.set(command.data.name, command);
    }
    //  Button interactions
    const buttonFiles = node_fs_1.default
        .readdirSync(__dirname + `/${buttonsFolder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of buttonFiles) {
        const command = require(`./${buttonsFolder}/${file}`);
        bot_1.client.buttons.set(command.id, command);
    }
    //  SelectMenus interactions
    const selectMenuFiles = node_fs_1.default
        .readdirSync(__dirname + `/${selectMenusFolder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of selectMenuFiles) {
        const command = require(`./${selectMenusFolder}/${file}`);
        bot_1.client.selectMenus.set(command.id, command);
    }
};
exports.loadCommands = loadCommands;
