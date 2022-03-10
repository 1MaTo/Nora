import { CacheType, CommandInteraction, MessageActionRow } from "discord.js";
import testCommand from "../commandData/test";
import { unhostGameButton } from "../components/buttons/hostGame";
import { ownerID } from "../utils/globals";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (interaction.user.id !== ownerID)
      return interaction.reply({
        ephemeral: true,
        content: "You cant user this command",
      });

    interaction.reply({
      content: "...",
      components: [new MessageActionRow().addComponents(unhostGameButton)],
    });
    return;
  },
};
