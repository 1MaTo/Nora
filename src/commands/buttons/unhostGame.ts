import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { unhostGame } from "../../api/ghost/unhostGame";
import {
  customErrorGameButton,
  errorGameButton,
  loadingGameButton,
  unhostSuccessGameButton,
} from "../../components/buttons/hostGame";
import { buttonId } from "../../utils/globals";

module.exports = {
  id: buttonId.unhostGame,
  async execute(interaction: ButtonInteraction) {
    await interaction.update({
      components: [new MessageActionRow().addComponents(loadingGameButton)],
    });

    const result = await unhostGame();

    switch (result) {
      case "success":
      case "timeout":
        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(unhostSuccessGameButton),
          ],
        });
        return;
      case "error":
      case "uknown":
        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(
              customErrorGameButton("This game already unhosted")
            ),
          ],
        });
        return;
      case null:
        await (interaction.message as Message).edit({
          components: [new MessageActionRow().addComponents(errorGameButton)],
        });
        return;
    }
  },
};
