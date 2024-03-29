import { CacheType, CommandInteraction } from "discord.js";
import { success, warning } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { msgDeleteTimeout } from "../../../utils/globals";
import { isRunning } from "../../gamestats/isRunning";
import { stopGamestats } from "../../gamestats/stopGamestats";

export const stop = async (interaction: CommandInteraction<CacheType>) => {
  const gamestatsSetting = await isRunning(interaction.guildId);

  if (!gamestatsSetting) {
    return editReply(
      interaction,
      {
        embeds: [warning("Nothing to stop") as any],
      },
      msgDeleteTimeout.default
    );
  }

  await stopGamestats(interaction.guildId);

  return editReply(
    interaction,
    { embeds: [success("Gamestats stoped") as any] },
    msgDeleteTimeout.default
  );
};
