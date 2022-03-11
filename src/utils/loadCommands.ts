import { Collection } from "discord.js";
import { client } from "../bot";
import fs from "node:fs";

const slashCommandsFolder = "../commands";
const buttonsFolder = "../commands/buttons";
const selectMenusFolder = "../commands/selectMenus";

export const loadCommands = () => {
  client.commands = new Collection();
  client.buttons = new Collection();
  client.selectMenus = new Collection();

  //  Slash command interactions
  const commandFiles = fs
    .readdirSync(__dirname + `/${slashCommandsFolder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./${slashCommandsFolder}/${file}`);
    client.commands.set(command.data.name, command);
  }

  //  Button interactions

  const buttonFiles = fs
    .readdirSync(__dirname + `/${buttonsFolder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of buttonFiles) {
    const command = require(`./${buttonsFolder}/${file}`);
    client.buttons.set(command.id, command);
  }

  //  SelectMenus interactions

  const selectMenuFiles = fs
    .readdirSync(__dirname + `/${selectMenusFolder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of selectMenuFiles) {
    const command = require(`./${selectMenusFolder}/${file}`);
    client.selectMenus.set(command.id, command);
  }
};
