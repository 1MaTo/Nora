import { client } from "../bot";
import { warning } from "../embeds/response";
import { guildIDs, ownerID, production } from "./globals";
import { log } from "./log";
import { logCommand } from "./logCmd";

export const listenCommands = () =>
  client.on("interactionCreate", async (interaction) => {
    if (production && interaction.guildId !== guildIDs.ghostGuild) return;
    if (!production && interaction.guildId !== guildIDs.debugGuild) return;

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (command.ownerOnly && interaction.user.id !== ownerID) {
      interaction.reply({
        embeds: [warning("This command is only for owner") as any],
      });
      return;
    }

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
