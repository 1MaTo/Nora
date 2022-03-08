import { CacheType, CommandInteraction } from "discord.js";
import { success, warning } from "../../../embeds/response";
import { groupsKey, redisKey } from "../../../redis/kies";
import { redis } from "../../../redis/redis";
import { editReply } from "../../../utils/discordMessage";
import { msgDeleteTimeout } from "../../../utils/globals";

export const ping_on_start = async (
  interaction: CommandInteraction<CacheType>
) => {
  const key = redisKey.struct(groupsKey.bindNickname, [
    interaction.guildId,
    interaction.user.id,
  ]);
  const userData = (await redis.get(key)) as userData;

  if (userData) {
    userData.settings.ping_on_start = interaction.options.getBoolean("value");
    redis.set(key, userData);
    await editReply(
      interaction,
      {
        embeds: [
          success(
            `Ping on start now ${interaction.options.getBoolean("value")}`
          ) as any,
        ],
      },
      msgDeleteTimeout.default
    );
    return;
  }
  await editReply(
    interaction,
    {
      embeds: [warning("No binded nicknames") as any],
    },
    msgDeleteTimeout.default
  );
};
