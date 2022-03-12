import { CacheType, CommandInteraction } from "discord.js";
import { error, success, warning } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { msgDeleteTimeout } from "../../../utils/globals";
import { loadMap } from "../../ghost/loadMap";

export const load = async (interaction: CommandInteraction<CacheType>) => {
  const result = await loadMap(interaction.options.getString("map"));

  switch (result) {
    case "success":
    case "timeout":
      await editReply(
        interaction,
        {
          embeds: [success(`Config loaded`) as any],
        },
        msgDeleteTimeout.short
      );
      return;
    case "error":
      await editReply(
        interaction,
        {
          embeds: [warning(`Can not load this config`) as any],
        },
        msgDeleteTimeout.short
      );
      return;
    case "uknown":
      await editReply(
        interaction,
        {
          embeds: [warning(`No maps found`) as any],
        },
        msgDeleteTimeout.short
      );
      return;
    case null:
      await editReply(
        interaction,
        {
          embeds: [error(`Network error`) as any],
        },
        msgDeleteTimeout.short
      );
      return;
  }
};
