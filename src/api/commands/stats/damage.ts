import { CacheType, CommandInteraction } from "discord.js";
import { loading, warning } from "../../../embeds/response";
import { leaderboardDamage } from "../../../embeds/stats";
import { editReply } from "../../../utils/discordMessage";
import { msgDeleteTimeout } from "../../../utils/globals";
import { getLeaderBordByDamage } from "../../../utils/MMDstats";

export const damage = async (interaction: CommandInteraction<CacheType>) => {
  const damageStats = await getLeaderBordByDamage();

  if (!damageStats) {
    await editReply(
      interaction,
      { embeds: [warning("No players for stats") as any] },
      msgDeleteTimeout.default
    );
    return;
  }

  await editReply(
    interaction,
    { embeds: [leaderboardDamage(damageStats) as any] },
    msgDeleteTimeout.info
  );
};
