import { Client, Events, GatewayIntentBits } from "discord.js";

import { replyWithError } from "#discord/reply-with-error.ts";
import { OWNER_ID, TOKEN } from "#env.ts";

import { commandList } from "./commands/shared/command-list.ts";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client) => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commandList.get(interaction.commandName);
  if (!command) {
    console.error("Command not found");
    return;
  }

  if (command.isAdminCommand && interaction.user.id !== OWNER_ID) {
    replyWithError(interaction, new Error("Admin command"));
  }

  try {
    await command.call(interaction);
  } catch (error) {
    replyWithError(interaction, error);
  }
});
