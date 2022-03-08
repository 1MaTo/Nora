import { CacheType, CommandInteraction } from "discord.js";
import { damage } from "../api/commands/stats/damage";
import { totalgames } from "../api/commands/stats/totalgames";
import { winrate } from "../api/commands/stats/winrate";
import statsCommand from "../commandData/stats";
import { ownerID, production } from "../utils/globals";

module.exports = {
  data: statsCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;

    interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case "totalgames":
        await totalgames(interaction);
        return;
      case "winrate":
        await winrate(interaction);
        return;
      case "damage":
        await damage(interaction);
        return;
      default:
        return await interaction.reply("...");
    }
  },
};
