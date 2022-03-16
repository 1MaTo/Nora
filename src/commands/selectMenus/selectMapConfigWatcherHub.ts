import {
  Message,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import { loadMapFromFile } from "../../api/ghost/loadMapFromFile";
import { pauseLobbyWatcher } from "../../api/lobbyWatcher/pauseLobbyWatcher";
import { resetCommandHubState } from "../../api/lobbyWatcher/resetCommandHubState";
import { resumeLobbyWatcher } from "../../api/lobbyWatcher/resumeLobbyWatcher";
import { updateLobbyWatcherSettings } from "../../api/lobbyWatcher/settingsApi";
import { hostGameButtonDefault } from "../../components/buttons/hostGame";
import {
  showConfigSelectorButtonError,
  showConfigSelectorButtonLoading,
  showConfigSelectorButtonSuccess,
} from "../../components/buttons/showConfigSelector";
import { buttonId, selectMenuId } from "../../utils/globals";
import { log } from "../../utils/log";

module.exports = {
  id: selectMenuId.selectMapConfigWatcherHub,
  async execute(interaction: SelectMenuInteraction) {
    const resumeLobbyKey = await pauseLobbyWatcher(interaction.guildId, 10000);

    const message = interaction.message as Message;
    const selectMenu = message.resolveComponent(
      selectMenuId.selectMapConfigWatcherHub
    ) as MessageSelectMenu;
    const hostButton =
      message.resolveComponent(buttonId.hostGame) ||
      hostGameButtonDefault({ disabled: true });
    const showConfigButton =
      message.resolveComponent(buttonId.showConfigSelector) ||
      showConfigSelectorButtonLoading();

    if (!selectMenu) return;

    await interaction.update({
      components: [
        new MessageActionRow().addComponents(hostButton, showConfigButton),
        new MessageActionRow().addComponents(
          selectMenu
            .setDisabled(true)
            .setPlaceholder(`Loading ${interaction.values[0]}...`)
        ),
      ],
    });

    const result = await loadMapFromFile(interaction.values[0]);

    switch (result) {
      case "success":
      case "timeout":
        log("[select map config] success/timeout");
        updateLobbyWatcherSettings(interaction.guildId, {
          lastLoadedMap: interaction.values[0],
          forceUpdate: true,
        });

        await message.edit({
          components: [
            new MessageActionRow().addComponents(
              hostButton,
              showConfigSelectorButtonSuccess()
            ),
          ],
        });
        break;
      case "uknown":
      case "error":
        log("[select map config] uknown/error");
        await message.edit({
          components: [
            new MessageActionRow().addComponents(
              hostButton,
              showConfigSelectorButtonError({ label: "Cant load this config" })
            ),
          ],
        });
        break;
      case null:
        log("[select map config] null");
        await message.edit({
          components: [
            new MessageActionRow().addComponents(
              hostButton,
              showConfigSelectorButtonError()
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
