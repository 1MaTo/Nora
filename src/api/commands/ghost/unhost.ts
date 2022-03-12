import { CacheType, CommandInteraction } from "discord.js";
import { error, success, warning } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { msgDeleteTimeout } from "../../../utils/globals";
import { unhostGame } from "../../ghost/unhostGame";

export const unhost = async (interaction: CommandInteraction<CacheType>) => {
  const result = await unhostGame();

  switch (result) {
    case "success":
    case "timeout":
      await editReply(
        interaction,
        {
          embeds: [success(`Game unhosted`) as any],
        },
        msgDeleteTimeout.short
      );
      return;
    case "error":
    case "uknown":
      await editReply(
        interaction,
        {
          embeds: [warning(`Nothing to unhost`) as any],
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
