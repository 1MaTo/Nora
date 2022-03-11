import { MessageSelectMenu } from "discord.js";
import { selectMenuId } from "../../utils/globals";

export const selectMapConfig = (options: string[], defaultOption?: string) => {
  return new MessageSelectMenu()
    .setCustomId(selectMenuId.selectMapConfig)
    .setPlaceholder("Select map config")
    .addOptions(
      options.map((option) => {
        return {
          label: option,
          value: option,
          default: option === defaultOption,
        };
      })
    );
};

export const loadingMapConfig = new MessageSelectMenu()
  .setCustomId(selectMenuId.selectMapConfig)
  .setPlaceholder("Loading config...")
  .setDisabled(true);
