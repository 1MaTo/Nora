import { ButtonInteraction, Message, MessageButton } from "discord.js";
import { pubGame } from "../../api/ghost/pubGame";
import { hostGameAnywhereButton } from "../../components/buttons/hostGame";
import { editMessageWithDelay } from "../../utils/discordMessage";
import { buttonId } from "../../utils/globals";

module.exports = {
  id: buttonId.hostGameAnywhere,
  async execute(interaction: ButtonInteraction) {
    const message = interaction.message as Message;
    const button = message.resolveComponent(
      buttonId.hostGameAnywhere
    ) as MessageButton;

    if (!button) return;

    const rowIndex = message.components.findIndex(
      (comp) =>
        comp.components.findIndex(
          (comp) => comp.customId === buttonId.hostGameAnywhere
        ) !== -1
    );
    const compIndex = message.components[rowIndex].components.findIndex(
      (comp) => comp.customId === buttonId.hostGameAnywhere
    );

    message.components[rowIndex].components[compIndex] = button
      .setLabel("Loading...")
      .setStyle("SECONDARY")
      .setDisabled(true);

    interaction.update({
      components: message.components,
    });

    const result = await pubGame("res publica game");

    if (result !== null) {
      message.components[rowIndex].components[compIndex] = button
        .setLabel("Game hosted")
        .setStyle("SUCCESS")
        .setDisabled(true);

      return message.edit({
        components: message.components,
      });
    } else {
      message.components[rowIndex].components[compIndex] = button
        .setLabel("Network error")
        .setStyle("DANGER")
        .setDisabled(true);

      await message.edit({
        components: message.components,
      });

      message.components[rowIndex].components[compIndex] =
        hostGameAnywhereButton;

      editMessageWithDelay(message, {
        components: message.components,
      });
    }
  },
};
