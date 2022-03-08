import { CacheType, CommandInteraction } from "discord.js";
import { error, loading, success } from "../../../embeds/response";
import { botStatusInfo } from "../../../utils/events";
import { botStatusVariables, ghostCmd } from "../../../utils/globals";
import { getCurrentLobbies } from "../../../utils/lobbyParser";
import { pingUsersOnStart } from "../../../utils/notifications";
import { startGame } from "../../ghost/startGame";

export const start = async (interaction: CommandInteraction<CacheType>) => {
  const result = await startGame(interaction.options.getBoolean("force"));

  const games = await getCurrentLobbies(interaction.guildId);

  if (result === null) {
    await interaction.editReply({
      embeds: [error(`Network error`) as any],
    });
  } else {
    botStatusVariables.gameCount += 1;
    botStatusInfo.emit(botEvent.update);

    if (result) {
      const game = games.find(
        (game) => game.gamename == result.replace(/[\[\]]/g, "")
      );

      if (game) {
        pingUsersOnStart(game, interaction.guildId);
      }
    }

    await interaction.editReply({ embeds: [success(`Command sent`) as any] });
  }

  setTimeout(() => interaction.deleteReply(), ghostCmd.deleteMessageTimeout);
};
