import { CacheType, CommandInteraction } from "discord.js";
import { start } from "../api/commands/gamestats/start";
import { stop } from "../api/commands/gamestats/stop";
import gamestatsCommand from "../commandData/gamestats";
import { warning } from "../embeds/response";
import { ownerID, production } from "../utils/globals";

module.exports = {
  data: gamestatsCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;

    if (!interaction.memberPermissions.has("ADMINISTRATOR"))
      return interaction.reply({
        embeds: [warning("This command only for admins") as any],
        ephemeral: true,
      });

    switch (interaction.options.getSubcommand()) {
      case "start":
        await start(interaction);
        return;
      case "stop":
        await stop(interaction);
        return;
      default:
        return await interaction.reply("...");
    }
  },
};
