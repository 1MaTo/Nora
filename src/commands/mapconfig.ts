import { CacheType, CommandInteraction } from "discord.js";
import { create } from "../api/commands/mapconfig/create";
import { deleteCofnig } from "../api/commands/mapconfig/delete";
import { show } from "../api/commands/mapconfig/show";
import mapconfigCommand from "../commandData/mapconfig";
import { ownerID, production } from "../utils/globals";

module.exports = {
  data: mapconfigCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;

    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case "create":
        await create(interaction);
        return;
      case "show":
        await show(interaction);
        return;
      case "delete":
        await deleteCofnig(interaction);
        return;
      default:
        return await interaction.editReply("...");
    }
  },
};
