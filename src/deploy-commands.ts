import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "node:fs";
import { appId, token } from "./auth.json";
import { guildIDs } from "./utils/globals";

const disabledCommands = ["upload"];
const commands = [];
const commandFiles = fs
  .readdirSync(__dirname + "/commandData")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commandData/${file}`) as SlashCommandBuilder;
  if (!disabledCommands.includes(command.name)) commands.push(command.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(
    Routes.applicationGuildCommands(
      appId,
      process.env.NODE_ENV === "production"
        ? guildIDs.ghostGuild
        : guildIDs.debugGuild
    ),
    {
      body: commands,
    }
  )
  .then(() => console.log("------> Commands registered"))
  .catch((err) => {
    console.log(err);
  });
