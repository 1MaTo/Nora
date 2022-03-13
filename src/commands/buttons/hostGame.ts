import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { pubGame } from "../../api/ghost/pubGame";
import { pauseLobbyWatcher } from "../../api/lobbyWatcher/pauseLobbyWatcher";
import { resetCommandHubState } from "../../api/lobbyWatcher/resetCommandHubState";
import { resumeLobbyWatcher } from "../../api/lobbyWatcher/resumeLobbyWatcher";
import {
  hostGameButtonDefault,
  hostGameButtonError,
  hostGameButtonLoading,
  hostGameButtonSuccess,
} from "../../components/buttons/hostGame";
import { showConfigSelectorButtonDefault } from "../../components/buttons/showConfigSelector";
import { createLobbyGame } from "../../db/queries";
import { botStatusInfo } from "../../utils/events";
import {
  botStatusVariables,
  buttonId,
  ghostGuildBotId,
} from "../../utils/globals";
import { getCurrentLobbies } from "../../utils/lobbyParser";

module.exports = {
  id: buttonId.hostGame,
  async execute(interaction: ButtonInteraction) {
    await interaction.update({
      components: [
        new MessageActionRow().addComponents(
          hostGameButtonLoading(),
          showConfigSelectorButtonDefault({ disabled: true })
        ),
      ],
    });

    const games = await getCurrentLobbies(interaction.guildId);

    if (games.some((game) => game.botid === ghostGuildBotId)) {
      await (interaction.message as Message).edit({
        components: [
          new MessageActionRow().addComponents(
            hostGameButtonError({ label: "Lobby already exist" }),
            showConfigSelectorButtonDefault({ disabled: true })
          ),
        ],
      });
      resetCommandHubState(interaction.message);
      return;
    }

    const resumeLobbyKey = await pauseLobbyWatcher(interaction.guildId, 10000);

    const result = await pubGame("res publica game");

    switch (result) {
      case "success":
      case "timeout":
        botStatusVariables.lobbyCount = botStatusVariables.lobbyCount + 1;
        botStatusInfo.emit(botEvent.update);

        await createLobbyGame(ghostGuildBotId);

        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(
              hostGameButtonSuccess(),
              showConfigSelectorButtonDefault({ disabled: true })
            ),
          ],
        });

        break;
      case "error":
      case "uknown":
        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(
              hostGameButtonError({ label: "No config loaded" }),
              showConfigSelectorButtonDefault({ disabled: true })
            ),
          ],
        });
        break;
      case null:
        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(
              hostGameButtonError(),
              showConfigSelectorButtonDefault({ disabled: true })
            ),
          ],
        });
        break;
    }

    await resetCommandHubState(interaction.message);
    await resumeLobbyWatcher(interaction.guildId);
    clearTimeout(resumeLobbyKey);
  },
};
