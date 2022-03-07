import { CacheType, CommandInteraction } from "discord.js";
import { error, loading, success } from "../../../embeds/response";
import { ghostCmd } from "../../../utils/globals";
import { unhostGame } from "../../ghost/unhostGame";

export const unhost = async (interaction: CommandInteraction<CacheType>) => {
  await interaction.reply({
    embeds: [loading() as any],
  });

  const result = await unhostGame();

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
