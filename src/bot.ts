import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ButtonInteraction,
  CacheType,
  Client,
  Collection,
  CommandInteraction,
  Intents,
  SelectMenuInteraction,
} from "discord.js";
import { reloadBot } from "./api/reload/reload";
import { token } from "./auth.json";
import { changeBotStatus, updateStatusInfo } from "./utils/botStatus";
import { clearRedisOnStart } from "./utils/clearRedisOnStart";
import { production } from "./utils/globals";
import { listenButtons } from "./utils/listenButtons";
import { listenCommands } from "./utils/listenCommands";
import { listenSelectMenus } from "./utils/listenSelectMenus";
import { loadCommands } from "./utils/loadCommands";
import { log } from "./utils/log";
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

export type CustomSelectMenuCommand = {
  id: string;
  execute: (interaction: SelectMenuInteraction) => Promise<void>;
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
  selectMenus: Collection<string, CustomSelectMenuCommand>;
};

loadCommands();

client.once("ready", async () => {
  log("------> SETTING UP");

  await clearRedisOnStart();

  if (production) {
    // Restart lobby watchers
    await changeBotStatus("☀ Just woke up");

    await sleep(2000);

    const lwCount = await restartLobbyWatcher();
    const gsCount = await restartGamestats();

    // Check for ghost status (available or no)
    setTimeout(() => ghostStatusUpdater(), 5000);
    setTimeout(() => lobbyStatusUpdater(), 10000);
    setTimeout(() => gamesStatusUpdater(1000 * 10), 15000);
    setTimeout(async () => {
      await changeBotStatus("🔄 Planned reboot 🔄");
      await reloadBot(false);
    }, 1000 * 60 * 60 * 24);
    await updateStatusInfo();
  }

  log("------> BOT IN DEVELOPMENT OR LOGS ENABLED");
});

listenCommands();
listenButtons();
listenSelectMenus();

process.on("unhandledRejection", (error) => {
  log("[bot]", error);
});

client.login(token);
