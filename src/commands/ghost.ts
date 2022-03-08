import { CacheType, CommandInteraction } from "discord.js";
import { load } from "../api/commands/ghost/load";
import { pub } from "../api/commands/ghost/pub";
import { start } from "../api/commands/ghost/start";
import { unhost } from "../api/commands/ghost/unhost";
import ghostCommand from "../commandData/ghost";
import { ownerID, production } from "../utils/globals";

module.exports = {
  data: ghostCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;

    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case "pub":
        await pub(interaction);
        return;
      case "start":
        await start(interaction);
        return;
      case "unhost":
        await unhost(interaction);
        return;
      case "load":
        await load(interaction);
        return;
      default:
        return await interaction.reply("...");
    }
  },
};
