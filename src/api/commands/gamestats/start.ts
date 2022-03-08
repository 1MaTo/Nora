import { CacheType, CommandInteraction } from "discord.js";
import { error, loading, success, warning } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { ghostCmd, msgDeleteTimeout } from "../../../utils/globals";
import { isRunning } from "../../gamestats/isRunning";
import { startGamestats } from "../../gamestats/startGamestats";

export const start = async (interaction: CommandInteraction<CacheType>) => {
  const gamestatsSetting = await isRunning(interaction.guildId);

  if (gamestatsSetting) {
    return editReply(
      interaction,
      {
        embeds: [warning("Gamestats already running") as any],
      },
      msgDeleteTimeout.default
    );
  }

  const channel =
    interaction.options.getChannel("channel") || interaction.channel;

  const result = await startGamestats(interaction.guildId, channel.id, 5000);

  if (result) {
    return editReply(
      interaction,
      { embeds: [success("Gamestats started") as any] },
      msgDeleteTimeout.default
    );
  } else {
    return editReply(
      interaction,
      { embeds: [error("Gamestats start error") as any] },
      msgDeleteTimeout.default
    );
  }
};
