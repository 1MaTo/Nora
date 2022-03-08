import { CacheType, CommandInteraction } from "discord.js";
import { error, success } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { ghostCmd } from "../../../utils/globals";
import { createOrUpdateMapConfig } from "../../../utils/mapConfig";

export const create = async (interaction: CommandInteraction<CacheType>) => {
  const slotMap = parseToSlotMap(interaction.options.getString("teams"));
  const maxSlotsInSlotMap =
    slotMap && slotMap.reduce((summ, curr) => (summ += curr.slots), 0);

  if (
    !slotMap ||
    maxSlotsInSlotMap !== interaction.options.getInteger("slots")
  ) {
    await editReply(
      interaction,
      { embeds: [error("Bad team values")] as any },
      ghostCmd.deleteMessageTimeout
    );
    return;
  }

  const isNew = await createOrUpdateMapConfig(interaction.guildId, {
    guildID: interaction.guildId,
    name: interaction.options.getString("name"),
    slotMap,
    slots: maxSlotsInSlotMap,
  } as mapConfig);

  if (isNew) {
    await editReply(
      interaction,
      {
        embeds: [success("New config created") as any],
      },
      ghostCmd.deleteMessageTimeout
    );
    return;
  }

  await editReply(
    interaction,
    {
      embeds: [success("Config was updated") as any],
    },
    ghostCmd.deleteMessageTimeout
  );
  return;
};

const parseToSlotMap = (raw: string): Array<mapConfigSlotMap> => {
  try {
    const slotMap = raw.split("|").reduce((teams, raw) => {
      const team = raw.split(",");
      if (isNaN(+team[1]) || +team[1] <= 0)
        throw new Error("Bad team slots value");
      return [
        ...teams,
        {
          name: team[0].trim(),
          slots: +team[1],
        },
      ];
    }, [] as Array<mapConfigSlotMap>);
    return slotMap;
  } catch (error) {
    return null;
  }
};
