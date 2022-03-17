import { client } from "../bot";
import { guildIDs, production } from "./globals";
import { log } from "./log";
import { logCommand } from "./logCmd";

export const listenCommands = () =>
  client.on("interactionCreate", async (interaction) => {
    if (production && interaction.guildId !== guildIDs.ghostGuild) return;
    if (!production && interaction.guildId !== guildIDs.debugGuild) return;

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
  });
