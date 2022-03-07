import { CacheType, CommandInteraction } from "discord.js";
import { error, loading, success } from "../../../embeds/response";
import { ghostCmd } from "../../../utils/globals";
import { loadMapCfg } from "../../ghost/loadMapCfg";

export const load = async (interaction: CommandInteraction<CacheType>) => {
  interaction.reply({
    embeds: [loading() as any],
  });

  const result = await loadMapCfg(interaction.options.getString("map"));

  if (result === null) {
    await interaction.editReply({
      embeds: [error(`Network error`) as any],
    });
  } else {
    await interaction.editReply({ embeds: [success(`Command sent`) as any] });
  }

  setTimeout(() => interaction.deleteReply(), ghostCmd.deleteMessageTimeout);
};
