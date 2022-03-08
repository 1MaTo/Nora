import { CacheType, CommandInteraction } from "discord.js";
import { loading, success } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { msgDeleteTimeout } from "../../../utils/globals";
import { unbindNickname } from "../../nickname/unbindNickname";

export const unbind = async (interaction: CommandInteraction<CacheType>) => {
  await unbindNickname(interaction.user.id, interaction.guildId);
  await editReply(
    interaction,
    { embeds: [success(`Nick unbinded`) as any] },
    msgDeleteTimeout.default
  );
};
