import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ButtonInteraction,
  CacheType,
  Client,
  Collection,
  CommandInteraction,
  Intents,
} from "discord.js";
import { reloadBot } from "./api/reload/reload";
import { token } from "./auth.json";
import { changeBotStatus, updateStatusInfo } from "./utils/botStatus";
import { guildIDs, production } from "./utils/globals";
import { listenButtons } from "./utils/listenButtons";
import { listenCommands } from "./utils/listenCommands";
import { loadCommands } from "./utils/loadCommands";
import { log } from "./utils/log";
import { logCommand } from "./utils/logCmd";
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

export type CustomButtonCommand = {
  id: string;
  execute: (interaction: ButtonInteraction) => Promise<void>;
};

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
}) as Client & {
  commands: Collection<string, CustomSlashCommand>;
  buttons: Collection<string, CustomButtonCommand>;
};

loadCommands();

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

listenCommands();
listenButtons();

/* client.on("interactionCreate", async (interaction) => {
  if (production && interaction.guildId !== guildIDs.ghostGuild) return;

  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  logCommand(interaction);

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
}); */

process.on("unhandledRejection", (error) => {
  log("[bot]", error);
});

client.login(token);
