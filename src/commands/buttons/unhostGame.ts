import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { pubGame } from "../../api/ghost/pubGame";
import { unhostGame } from "../../api/ghost/unhostGame";
import {
  errorGameButton,
  loadingGameButton,
  successGameButton,
  unhostSuccessGameButton,
} from "../../components/buttons/hostGame";
import { buttonId } from "../../utils/globals";

module.exports = {
  id: buttonId.unhostGame,
  async execute(interaction: ButtonInteraction) {
    interaction.update({
      components: [new MessageActionRow().addComponents(loadingGameButton)],
    });

    const result = await unhostGame();

    if (result) {
      return (interaction.message as Message).edit({
        components: [
          new MessageActionRow().addComponents(unhostSuccessGameButton),
        ],
      });
    } else {
      return (interaction.message as Message).edit({
        components: [new MessageActionRow().addComponents(errorGameButton)],
      });
    }
  },
};
