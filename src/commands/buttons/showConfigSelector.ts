import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { pauseLobbyWatcher } from "../../api/lobbyWatcher/pauseLobbyWatcher";
import { resetCommandHubState } from "../../api/lobbyWatcher/resetCommandHubState";
import { resumeLobbyWatcher } from "../../api/lobbyWatcher/resumeLobbyWatcher";
import { hostGameButtonDefault } from "../../components/buttons/hostGame";
import {
  showConfigSelectorButtonError,
  showConfigSelectorButtonLoading,
} from "../../components/buttons/showConfigSelector";
import { mapConfigSelectorDefault } from "../../components/selectMenus/mapConfigSelector";
import { buttonId, ghostGuildBotId } from "../../utils/globals";
import { getCurrentLobbies } from "../../utils/lobbyParser";
import { getConfigListFromGhost } from "../../utils/requestToGuiServer";

module.exports = {
  id: buttonId.showConfigSelector,
  async execute(interaction: ButtonInteraction) {
    const hostButtonPrev = (interaction.message as Message).resolveComponent(
      buttonId.hostGame
    );

    const currentHostButton = hostButtonPrev
      ? hostButtonPrev.setDisabled(true)
      : hostGameButtonDefault({ disabled: true });

    await interaction.update({
      components: [
        new MessageActionRow().addComponents(
          currentHostButton,
          showConfigSelectorButtonLoading()
        ),
      ],
    });

    const resumeLobbyKey = await pauseLobbyWatcher(interaction.guildId, 5000);

    const games = await getCurrentLobbies(interaction.guildId);

    //  Cant loading configs when lobby exist
    if (games.some((game) => game.botid === ghostGuildBotId)) {
      await (interaction.message as Message).edit({
        components: [
          new MessageActionRow().addComponents(
            currentHostButton,
            showConfigSelectorButtonError({
              label: "Cant load config when lobby exist",
              disabled: true,
            })
          ),
        ],
      });
      await resetCommandHubState(interaction.message);
      clearTimeout(resumeLobbyKey);
      await resumeLobbyWatcher(interaction.guildId);
      return;
    }

    const configs = await getConfigListFromGhost();

    //  Network error
    if (!configs) {
      (interaction.message as Message).edit({
        components: [
          new MessageActionRow().addComponents(
            currentHostButton,
            showConfigSelectorButtonError({
              label: "Network error",
              disabled: true,
            })
          ),
        ],
      });
      await resetCommandHubState(interaction.message);
      clearTimeout(resumeLobbyKey);
      await resumeLobbyWatcher(interaction.guildId);
      return;
    }

    //  No configs exist for load
    if (configs.length === 0) {
      (interaction.message as Message).edit({
        components: [
          new MessageActionRow().addComponents(
            currentHostButton,
            showConfigSelectorButtonError({
              label: "No configs found",
              disabled: true,
            })
          ),
        ],
      });
      await resetCommandHubState(interaction.message);
      clearTimeout(resumeLobbyKey);
      await resumeLobbyWatcher(interaction.guildId);
      return;
    }

    //  All good, create config selector
    (interaction.message as Message).edit({
      components: [
        new MessageActionRow().addComponents(
          currentHostButton,
          showConfigSelectorButtonLoading({
            disabled: true,
            label: "Selecting map...",
          })
        ),
        new MessageActionRow().addComponents(
          mapConfigSelectorDefault({ options: configs })
        ),
      ],
    });
    return;
  },
};
