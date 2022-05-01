"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const node_fs_1 = __importDefault(require("node:fs"));
const auth_json_1 = require("./auth.json");
const globals_1 = require("./utils/globals");
const disabledCommands = [];
const commands = [];
const commandFiles = node_fs_1.default
    .readdirSync(__dirname + "/commandData")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commandData/${file}`);
    if (!disabledCommands.includes(command.name))
        commands.push(command.toJSON());
}
const rest = new rest_1.REST({ version: "9" }).setToken(auth_json_1.token);
rest
    .put(v9_1.Routes.applicationGuildCommands(auth_json_1.appId, process.env.NODE_ENV === "production"
    ? globals_1.guildIDs.ghostGuild
    : globals_1.guildIDs.debugGuild), {
    body: commands,
})
    .then(() => console.log("------> Commands registered"))
    .catch((err) => {
    console.log(err);
});
