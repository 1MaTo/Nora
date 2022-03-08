import { CacheType, CommandInteraction } from "discord.js";
import { loading, success, warning } from "../../../embeds/response";
import { ghostCmd } from "../../../utils/globals";
import { isRunning } from "../../lobbyWatcher/isRunning";
import { stopLobbyWatcher } from "../../lobbyWatcher/stopLobbyWatcher";

export const stop = async (interaction: CommandInteraction<CacheType>) => {
  const lobbyInfo = await isRunning(interaction.guildId);

  if (lobbyInfo) {
    await stopLobbyWatcher(interaction.guildId);
    await interaction.editReply({
      embeds: [success("Lobby watcher stoped") as any],
    });
  } else {
    await interaction.editReply({
      embeds: [warning("Lobby watcher isn't running on this server") as any],
    });
  }

  setTimeout(() => interaction.deleteReply(), ghostCmd.deleteMessageTimeout);
};
