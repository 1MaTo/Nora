import { CacheType, CommandInteraction } from "discord.js";
import { getNicknames } from "../../../db/queries";
import { body, loading, success, warning } from "../../../embeds/response";
import { editReply } from "../../../utils/discordMessage";
import { getMember } from "../../../utils/discordUser";
import { msgDeleteTimeout } from "../../../utils/globals";
import { bindNickname } from "../../nickname/bindNickname";
import { freeNickname } from "../../nickname/freeNickname";

export const bind = async (interaction: CommandInteraction<CacheType>) => {
  const nick = interaction.options.getString("nickname");
  const isFree = await freeNickname(nick, interaction.guildId);

  if (!isFree) {
    const nicks = await getNicknames();
    const findNicknames = nicks
      .filter((item: string) => new RegExp(nick, "i").test(item))
      .join("\n");

    if (findNicknames && findNicknames.length <= 4096) {
      return await editReply(
        interaction,
        {
          embeds: [
            body(
              `Can't find nickname, maybe use one of this?`,
              findNicknames
            ) as any,
          ],
        },
        msgDeleteTimeout.long
      );
    }

    return await editReply(
      interaction,
      { embeds: [warning(`Bad nickname`) as any] },
      msgDeleteTimeout.default
    );
  }

  if (typeof isFree === "string") {
    const member = await getMember(interaction.guildId, isFree as string);
    await editReply(
      interaction,
      {
        embeds: [warning(`This nickname binded to ${member.user.tag}`) as any],
      },
      msgDeleteTimeout.default
    );
    return;
  }

  await bindNickname(nick, interaction.user.id, interaction.guildId);
  await editReply(
    interaction,
    { embeds: [success(`${nick} binded`) as any] },
    msgDeleteTimeout.default
  );
  return;
};
