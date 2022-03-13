import { CacheType, CommandInteraction } from "discord.js";
import { pauseLobbyWatcher } from "../api/lobbyWatcher/pauseLobbyWatcher";
import testCommand from "../commandData/test";
import { ownerID } from "../utils/globals";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (interaction.user.id !== ownerID)
      return interaction.reply({
        ephemeral: true,
        content: "You cant user this command",
      });

    await interaction.deferReply();

    await pauseLobbyWatcher(interaction.guildId, 5000);

    await interaction.editReply({
      content: "sda",
    });
    return;
  },
};
