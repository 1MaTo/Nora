import { CacheType, CommandInteraction } from "discord.js";
import { error, success, warning } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { botEvents } from "../../../utils/events";
import {
  botStatusVariables,
  ghostGuildBotId,
  msgDeleteTimeout,
} from "../../../utils/globals";
import { getCurrentLobbies } from "../../../utils/lobbyParser";
import { pubGame } from "../../ghost/pubGame";

export const pub = async (interaction: CommandInteraction<CacheType>) => {
  const games = await getCurrentLobbies(interaction.guildId);

  if (games.some((game) => game.botid === ghostGuildBotId)) {
    await editReply(
      interaction,
      {
        embeds: [warning(`Lobby already exist`) as any],
      },
      msgDeleteTimeout.short
    );
    return;
  }

  const result = await pubGame(interaction.options.getString("gamename"));

  switch (result) {
    case "success":
    case "timeout":
      botStatusVariables.lobbyCount = botStatusVariables.lobbyCount + 1;
      botEvents.emit(botEvent.update);

      await editReply(
        interaction,
        {
          embeds: [success(`Game hosted`) as any],
        },
        msgDeleteTimeout.short
      );
      return;
    case "error":
    case "uknown":
      await editReply(
        interaction,
        {
          embeds: [warning(`No config loaded`) as any],
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
