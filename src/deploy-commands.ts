import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { appId, token } from "./auth.json";
import { guildIDs } from "./utils/globals";
import { log } from "./utils/log";
import { report } from "./utils/reportToOwner";
import fs from "node:fs";

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(appId, guildIDs.debugGuild), {
    body: commands,
  })
  .then(() => log("------> Commands registered"))
  .catch((err) => {
    log(err);
    report(err);
  });
