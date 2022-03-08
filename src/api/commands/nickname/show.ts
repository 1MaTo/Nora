import { CacheType, CommandInteraction } from "discord.js";
import { body, warning } from "../../../embeds/response";
import { groupsKey, redisKey } from "../../../redis/kies";
import { redis } from "../../../redis/redis";
import { editReply } from "../../../utils/discordMessage";
import { msgDeleteTimeout } from "../../../utils/globals";

export const show = async (interaction: CommandInteraction<CacheType>) => {
  const key = redisKey.struct(groupsKey.bindNickname, [
    interaction.guildId,
    interaction.user.id,
  ]);
  const userData = (await redis.get(key)) as userData;

  if (!userData) {
    await editReply(
      interaction,
      {
        embeds: [warning("Nickname not binded") as any],
      },
      msgDeleteTimeout.default
    );
    return;
  }

  await editReply(
    interaction,
    {
      embeds: [
        body(
          userData.nickname,
          `${Object.entries(userData.settings)
            .map((field) => `[${field[0]}]: \`${field[1]}\``)
            .join("\n")}`
        ) as any,
      ],
    },
    msgDeleteTimeout.default
  );
};
