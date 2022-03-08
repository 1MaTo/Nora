import { CacheType, CommandInteraction } from "discord.js";
import { error, success } from "../../../embeds/response";
import { ghostCmd } from "../../../utils/globals";
import { pubGame } from "../../ghost/pubGame";

export const pub = async (interaction: CommandInteraction<CacheType>) => {
  const result = await pubGame(interaction.options.getString("gamename"));

  if (result === null) {
    await interaction.editReply({
      embeds: [error(`Network error`) as any],
    });
  } else {
    await interaction.editReply({
      embeds: [success(`Command sent`) as any],
    });
  }

  setTimeout(() => interaction.deleteReply(), ghostCmd.deleteMessageTimeout);
};
