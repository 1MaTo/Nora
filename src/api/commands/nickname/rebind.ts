import { CacheType, CommandInteraction } from "discord.js";
import {
  error,
  info,
  loading,
  success,
  warning,
} from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { getMember } from "../../../utils/discordUser";
import { msgDeleteTimeout } from "../../../utils/globals";
import { bindNickname } from "../../nickname/bindNickname";
import { freeNickname } from "../../nickname/freeNickname";
import { unbindNickname } from "../../nickname/unbindNickname";

export const rebind = async (interaction: CommandInteraction<CacheType>) => {
  if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
    return await editReply(
      interaction,
      {
        embeds: [error("Need to be admin for rebind") as any],
      },
      msgDeleteTimeout.default
    );
  }

  const nick = interaction.options.getString("nickname");
  const userID = interaction.options.getUser("user").id;
  const isFree = await freeNickname(nick, interaction.guildId);

  if (!isFree) {
    await editReply(
      interaction,
      { embeds: [warning(`Bad nickname | This nickname is free`) as any] },
      msgDeleteTimeout.default
    );
    return;
  }

  if (typeof isFree === "string") {
    const member = await getMember(interaction.guildId, isFree as string);

    await unbindNickname(member.id, interaction.guildId);
    await editReply(interaction, {
      embeds: [info(`Unbind ${nick} from ${member.user.tag}`) as any],
    });
  }

  await bindNickname(nick, userID, interaction.guildId);
  const member = await getMember(interaction.guildId, userID);
  await editReply(
    interaction,
    {
      embeds: [success(`${nick} binded to ${member.user.tag}`) as any],
    },
    msgDeleteTimeout.default
  );
  return;
};
