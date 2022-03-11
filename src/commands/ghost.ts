import { CacheType, CommandInteraction } from "discord.js";
import { load } from "../api/commands/ghost/load";
import { pub } from "../api/commands/ghost/pub";
import { select } from "../api/commands/ghost/select";
import { start } from "../api/commands/ghost/start";
import { unhost } from "../api/commands/ghost/unhost";
import ghostCommand from "../commandData/ghost";
import { ownerID, production } from "../utils/globals";

module.exports = {
  data: ghostCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;

    switch (interaction.options.getSubcommand()) {
      case "pub":
        await interaction.deferReply();
        await pub(interaction);
        return;
      case "start":
        await interaction.deferReply();
        await start(interaction);
        return;
      case "unhost":
        await interaction.deferReply();
        await unhost(interaction);
        return;
      case "load-map":
        await interaction.deferReply();
        await load(interaction);
        return;
      case "select-map":
        await interaction.deferReply();
        await select(interaction);
        return;
      default:
        return await interaction.editReply("...");
    }
  },
};
