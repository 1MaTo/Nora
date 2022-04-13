import { CacheType, CommandInteraction } from "discord.js";
import testCommand from "../commandData/test";
import { ownerID } from "../utils/globals";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (interaction.user.id !== ownerID)
      return interaction.reply({
        ephemeral: true,
        content: "You cant use this command",
      });

    await interaction.deferReply();

    await interaction.editReply({
      content: "kek",
    });
    return;
  },
};
