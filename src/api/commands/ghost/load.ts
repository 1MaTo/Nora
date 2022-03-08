import { CacheType, CommandInteraction } from "discord.js";
import { error, success } from "../../../embeds/response";
import { ghostCmd } from "../../../utils/globals";
import { loadMap } from "../../ghost/loadMap";

export const load = async (interaction: CommandInteraction<CacheType>) => {
  const result = await loadMap(interaction.options.getString("map"));

  if (result === null) {
    await interaction.editReply({
      embeds: [error(`Network error`) as any],
    });
  } else {
    await interaction.editReply({ embeds: [success(`Command sent`) as any] });
  }

  setTimeout(() => interaction.deleteReply(), ghostCmd.deleteMessageTimeout);
};
