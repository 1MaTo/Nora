import { CacheType, CommandInteraction } from "discord.js";
import { error, success, warning } from "../../../embeds/response";
import { ghostCmd } from "../../../utils/globals";
import { isRunning } from "../../lobbyWatcher/isRunning";
import { startLobbyWatcher } from "../../lobbyWatcher/startLobbyWatcher";

export const start = async (interaction: CommandInteraction<CacheType>) => {
  const lobbyInfo = await isRunning(interaction.guildId);

  if (lobbyInfo) {
    await interaction.editReply({
      embeds: [
        warning("Lobby watcher is already running on this server") as any,
      ],
    });
  } else {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    const delay = interaction.options.getInteger("delay") || 10000;

    const result = await startLobbyWatcher(
      interaction.guildId,
      channel.id,
      delay
    );

    if (result) {
      await interaction.editReply({
        embeds: [success(`Lobby watcher started`) as any],
      });
    } else {
      await interaction.editReply({
        embeds: [error(`Failed to start lobby watcher`) as any],
      });
    }
  }

  setTimeout(() => interaction.deleteReply(), ghostCmd.deleteMessageTimeout);
};
