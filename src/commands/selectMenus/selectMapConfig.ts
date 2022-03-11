import {
  Message,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import { loadMapFromFile } from "../../api/ghost/loadMapFromFile";
import { hostGameAnywhereButton } from "../../components/buttons/hostGame";
import { error } from "../../embeds/response";
import { deleteMessageWithDelay } from "../../utils/discordMessage";
import { msgDeleteTimeout, selectMenuId } from "../../utils/globals";

module.exports = {
  id: selectMenuId.selectMapConfig,
  async execute(interaction: SelectMenuInteraction) {
    const message = interaction.message as Message;
    const selectMenu = message.resolveComponent(
      selectMenuId.selectMapConfig
    ) as MessageSelectMenu;

    const rowIndex = message.components.findIndex(
      (comp) =>
        comp.components.findIndex(
          (comp) => comp.customId === selectMenuId.selectMapConfig
        ) !== -1
    );
    const compIndex = message.components[rowIndex].components.findIndex(
      (comp) => comp.customId === selectMenuId.selectMapConfig
    );

    if (!selectMenu) return;

    message.components[rowIndex].components[compIndex] = selectMenu
      .setDisabled(true)
      .setPlaceholder(`Loading ${interaction.values[0]}...`);

    await interaction.update({ components: message.components });

    const result = await loadMapFromFile(interaction.values[0]);

    if (result === null) {
      message.components[rowIndex].components[compIndex] = selectMenu
        .setDisabled(true)
        .setPlaceholder(`Network error`);
      await message.edit({ components: message.components });
      deleteMessageWithDelay(message);
      return;
    }

    await message.edit({
      components: [
        new MessageActionRow().addComponents(
          selectMenu.setDisabled(true).setPlaceholder("Map loaded")
        ),
      ],
    });
    deleteMessageWithDelay(message, msgDeleteTimeout.default);
  },
};
