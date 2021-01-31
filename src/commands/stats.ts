import { CommandContext, SlashCommand } from "slash-create";
import { statsCommand } from "../commandsObjects/stats";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { guildIDs, ownerID, production } from "../utils/globals";

export default class stats extends SlashCommand {
  constructor(creator: any) {
    super(creator, statsCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;

    if (ctx.options.totalgames) {
      const key = redisKey.struct(groupsKey.bindNickname, [
        ctx.guildID,
        ctx.member.id,
      ]);
      const bindedNick = await redis.get(key);
      const nickName = ctx.options.totalgames["nickname"] || bindedNick;
    }

    if (ctx.options.winrate) {
    }
    return;
  }
}
