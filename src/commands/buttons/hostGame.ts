import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { pubGame } from "../../api/ghost/pubGame";
import {
  errorGameButton,
  loadingGameButton,
  successGameButton,
} from "../../components/buttons/hostGame";
import { buttonId } from "../../utils/globals";

module.exports = {
  id: buttonId.hostGame,
  async execute(interaction: ButtonInteraction) {
    interaction.update({
      components: [new MessageActionRow().addComponents(loadingGameButton)],
    });

    const result = await pubGame("res publica game");

    if (result) {
      return (interaction.message as Message).edit({
        components: [new MessageActionRow().addComponents(successGameButton)],
      });
    } else {
      return (interaction.message as Message).edit({
        components: [new MessageActionRow().addComponents(errorGameButton)],
      });
    }
  },
};
