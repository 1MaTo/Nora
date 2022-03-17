import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { unhostGame } from "../../api/ghost/unhostGame";
import { pauseLobbyWatcher } from "../../api/lobbyWatcher/pauseLobbyWatcher";
import { resetLobbyHubState } from "../../api/lobbyWatcher/resetLobbyHubState";
import { resumeLobbyWatcher } from "../../api/lobbyWatcher/resumeLobbyWatcher";
import { startGameButtonDefault } from "../../components/buttons/startGame";
import {
  unhostGameButtonError,
  unhostGameButtonLoading,
} from "../../components/buttons/unhostGame";
import { clearLobbyGame } from "../../db/queries";
import { buttonId, ghostGuildBotId } from "../../utils/globals";

module.exports = {
  id: buttonId.unhostGame,
  async execute(interaction: ButtonInteraction) {
    await interaction.update({
      components: [
        new MessageActionRow().addComponents(
          startGameButtonDefault({ disabled: true }),
          unhostGameButtonLoading()
        ),
      ],
    });

    const resumeLobbyKey = await pauseLobbyWatcher(interaction.guildId, 10000);

    const result = await unhostGame();

    switch (result) {
      case "success":
      case "timeout":
        await clearLobbyGame(ghostGuildBotId);
        await (interaction.message as Message).delete();
        break;
      case "error":
      case "uknown":
        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(
              startGameButtonDefault({ disabled: true }),
              unhostGameButtonError({ label: "This game already unhosted" })
            ),
          ],
        });
        break;
      case null:
        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(
              startGameButtonDefault({ disabled: true }),
              unhostGameButtonError()
            ),
          ],
        });
        break;
    }

    clearTimeout(resumeLobbyKey);
    await resetLobbyHubState(interaction.message);
    resumeLobbyWatcher(interaction.guildId);
  },
};
