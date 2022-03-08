import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CacheType,
  Client,
  Collection,
  CommandInteraction,
  Intents,
} from "discord.js";
import fs from "node:fs";
import { reloadBot } from "./api/reload/reload";
import { token } from "./auth.json";
import { changeBotStatus, updateStatusInfo } from "./utils/botStatus";
import { production } from "./utils/globals";
import { log } from "./utils/log";
import { report } from "./utils/reportToOwner";
import { restartGamestats, restartLobbyWatcher } from "./utils/restartTimers";
import { sleep } from "./utils/sleep";
import {
  gamesStatusUpdater,
  ghostStatusUpdater,
  lobbyStatusUpdater,
} from "./utils/timerFuncs";

export type CustomSlashCommand = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
};

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
}) as Client & { commands: Collection<string, CustomSlashCommand> };
client.commands = new Collection();

const commandFiles = fs
  .readdirSync(__dirname + "/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
  log("------> SETTING UP");

  if (production) {
    // Restart lobby watchers
    await changeBotStatus("☀ Just woke up");

    sleep(2000);

    const lwCount = await restartLobbyWatcher();
    const gsCount = await restartGamestats();

    // Check for ghost status (available or no)
    setTimeout(() => ghostStatusUpdater(), 5000);
    setTimeout(() => lobbyStatusUpdater(), 10000);
    setTimeout(() => gamesStatusUpdater(1000 * 60 * 5), 15000);
    setTimeout(async () => {
      await changeBotStatus("🔄 Planned reboot 🔄");
      await reloadBot(false);
    }, 1000 * 60 * 60 * 24);
    await updateStatusInfo();
  }

  log("------> BOT IN DEVELOPMENT");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    log(error);
    try {
      await interaction.reply({
        content: ">_< Bakaaa!!! ",
        ephemeral: true,
      });
    } catch (err) {
      log(error);
    }
  }
});

process.on("unhandledRejection", (error) => {
  log("[bot]", error);
});

client.login(token);
