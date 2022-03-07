import { CacheType, CommandInteraction } from "discord.js";
import { loading, success, warning } from "../../../embeds/response";
import { ghostCmd } from "../../../utils/globals";
import { deleteMapConfig } from "../../../utils/mapConfig";

export const deleteCofnig = async (
  interaction: CommandInteraction<CacheType>
) => {
  await interaction.reply({
    embeds: [loading() as any],
  });

  const cfgName = interaction.options.getString("name");
  const deleted = await deleteMapConfig(interaction.guildId, cfgName);

  if (deleted) {
    await interaction.editReply({
      embeds: [success(`${cfgName} deleted`) as any],
    });
    setTimeout(() => interaction.deleteReply(), ghostCmd.deleteMessageTimeout);
    return;
  }

  await interaction.editReply({
    embeds: [warning(`Can't find ${cfgName}`) as any],
  });
  setTimeout(() => interaction.deleteReply(), ghostCmd.deleteMessageTimeout);
};
