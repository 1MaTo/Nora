import { Message, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { loadMapFromFile } from "../../api/ghost/loadMapFromFile";
import { error, success, warning } from "../../embeds/response";
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

    switch (result) {
      case "success":
      case "timeout":
        await message.edit({
          embeds: [success(`${interaction.values[0]} loaded`) as any],
          components: [],
        });
        deleteMessageWithDelay(message, msgDeleteTimeout.default);
        return;
      case "uknown":
      case "error":
        await message.edit({
          embeds: [warning(`Can not load this config`) as any],
          components: [],
        });
        deleteMessageWithDelay(message, msgDeleteTimeout.default);
        return;
      case null:
        await message.edit({
          embeds: [error(`Network error`) as any],
          components: [],
        });
        deleteMessageWithDelay(message, msgDeleteTimeout.default);
    }
  },
};
