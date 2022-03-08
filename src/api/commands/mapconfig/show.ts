import { CacheType, CommandInteraction } from "discord.js";
import { mapConfigInfo, mapConfigList } from "../../../embeds/mapconfig";
import { loading, warning } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { ghostCmd, msgDeleteTimeout } from "../../../utils/globals";
import { log } from "../../../utils/log";
import {
  getGuildMapConfigs,
  searchMapConfigByName,
} from "../../../utils/mapConfig";

export const show = async (interaction: CommandInteraction<CacheType>) => {
  const cfgName = interaction.options.getString("name");

  if (cfgName) {
    const cfg = await searchMapConfigByName(cfgName, interaction.guildId);

    if (cfg) {
      return await editReply(
        interaction,
        { embeds: [mapConfigInfo(cfg) as any] },
        msgDeleteTimeout.long
      );
    }

    return await editReply(
      interaction,
      { embeds: [warning(`Can't find ${cfgName}`) as any] },
      ghostCmd.deleteMessageTimeout
    );
  }

  const configs = await getGuildMapConfigs(interaction.guildId);

  if (configs.length === 0) {
    return await editReply(
      interaction,
      { embeds: [warning("No map configs found") as any] },
      ghostCmd.deleteMessageTimeout
    );
  }

  return await editReply(
    interaction,
    { embeds: [mapConfigList(configs.map((cfg) => cfg.name)) as any] },
    msgDeleteTimeout.long
  );
};
