import { Client, Events, GatewayIntentBits } from "discord.js";

import { commandList } from "./commands/shared/command-list.ts";
import { replyWithError } from "./utils/discord/reply-with-error.ts";
import { TOKEN } from "./utils/shared/env.ts";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client) => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commandList.get(interaction.commandName);
  if (!commandList) {
    console.error("Command not found");
    return;
  }

  try {
    await command.call(interaction);
  } catch (error) {
    replyWithError(interaction, error);
  }
});
