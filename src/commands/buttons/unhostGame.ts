import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { unhostGame } from "../../api/ghost/unhostGame";
import { pauseLobbyWatcher } from "../../api/lobbyWatcher/pauseLobbyWatcher";
import { resumeLobbyWatcher } from "../../api/lobbyWatcher/resumeLobbyWatcher";
import {
  customErrorGameButton,
  errorGameButton,
  loadingGameButton,
} from "../../components/buttons/hostGame";
import { clearLobbyGame } from "../../db/queries";
import { buttonId, ghostGuildBotId } from "../../utils/globals";

module.exports = {
  id: buttonId.unhostGame,
  async execute(interaction: ButtonInteraction) {
    await interaction.update({
      components: [new MessageActionRow().addComponents(loadingGameButton)],
    });

    const resumeLobbyKey = await pauseLobbyWatcher(interaction.guildId, 10000);

    const result = await unhostGame();

    switch (result) {
      case "success":
      case "timeout":
        await clearLobbyGame(ghostGuildBotId);
        await (interaction.message as Message).delete();
        /* await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(unhostSuccessGameButton),
          ],
        }); */
        break;
      case "error":
      case "uknown":
        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(
              customErrorGameButton("This game already unhosted")
            ),
          ],
        });
        break;
      case null:
        await (interaction.message as Message).edit({
          components: [new MessageActionRow().addComponents(errorGameButton)],
        });
        break;
    }

    await resumeLobbyWatcher(interaction.guildId);
    clearTimeout(resumeLobbyKey);
  },
};
