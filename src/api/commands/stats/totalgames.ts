import { CacheType, CommandInteraction } from "discord.js";
import { warning } from "../../../embeds/response";
import { totalGamesForNickname } from "../../../embeds/stats";
import { groupsKey, redisKey } from "../../../redis/kies";
import { redis } from "../../../redis/redis";
import { editReply } from "../../../utils/discordMessage";
import { msgDeleteTimeout } from "../../../utils/globals";
import { log } from "../../../utils/log";
import { getGroupedGamesWithConfig } from "../../stats/getGroupedGamesWithConfig";
import { getTotalGamesStats } from "../../stats/getTotalGamesStats";

export const totalgames = async (
  interaction: CommandInteraction<CacheType>
) => {
  const key = redisKey.struct(groupsKey.bindNickname, [
    interaction.guildId,
    interaction.user.id,
  ]);
  const user = (await redis.get(key)) as userData;
  const nickName =
    interaction.options.getString("nickname") || (user && user.nickname);

  if (!nickName) {
    await editReply(
      interaction,
      { embeds: [warning("No nickname") as any] },
      msgDeleteTimeout.default
    );
    return;
  }

  const games = await getTotalGamesStats(interaction.guildId, nickName);

  if (!games) {
    await editReply(
      interaction,
      { embeds: [warning(`No games for ${nickName}`) as any] },
      msgDeleteTimeout.long
    );
    return;
  }

  const groupedGamesData = getGroupedGamesWithConfig(games);
  await editReply(
    interaction,
    {
      embeds: [totalGamesForNickname(nickName, groupedGamesData) as any],
    },
    msgDeleteTimeout.long
  );
};
