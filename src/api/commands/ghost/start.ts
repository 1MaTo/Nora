import { CacheType, CommandInteraction } from "discord.js";
import { error, success, warning } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { botEvents } from "../../../utils/events";
import { botStatusVariables, msgDeleteTimeout } from "../../../utils/globals";
import { getCurrentLobbies } from "../../../utils/lobbyParser";
import { pingUsersOnStart } from "../../../utils/notifications";
import { startGame } from "../../ghost/startGame";

export const start = async (interaction: CommandInteraction<CacheType>) => {
  const games = await getCurrentLobbies(interaction.guildId);

  if (games.length === 0) {
    await editReply(
      interaction,
      {
        embeds: [warning(`No lobbies to start`) as any],
      },
      msgDeleteTimeout.short
    );
    return;
  }

  const result = await startGame(true);

  switch (result) {
    case "success":
    case "timeout":
    case "error":
    case "uknown":
      botStatusVariables.gameCount = botStatusVariables.gameCount + 1;
      botEvents.emit(botEvent.update);

      const game = games.find(
        (game) => game.gamename == result.replace(/[\[\]]/g, "")
      );

      if (game) {
        pingUsersOnStart(game, interaction.guildId);
      }

      await editReply(
        interaction,
        {
          embeds: [success(`Game started`) as any],
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
