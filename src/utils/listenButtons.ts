import { client } from "../bot";
import { guildIDs, production } from "./globals";
import { log } from "./log";
import { logButtonCommand } from "./logCmd";

export const listenButtons = () =>
  client.on("interactionCreate", async (interaction) => {
    if (production && interaction.guildId !== guildIDs.ghostGuild) return;
    if (!production && interaction.guildId !== guildIDs.debugGuild) return;

    if (!interaction.isButton()) return;

    const command = client.buttons.get(interaction.customId);

    if (!command) return;

    logButtonCommand(interaction);

    try {
      await command.execute(interaction);
    } catch (error) {
      log(error);
    }
  });
