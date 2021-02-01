import { CommandContext, SlashCommand } from "slash-create";
import {
  guildIDs,
  msgDeleteTimeout,
  ownerID,
  production,
} from "../utils/globals";
import { gamestatsCommand } from "../commandsObjects/gamestats";
import { getTextChannel } from "../utils/discordChannel";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { log } from "../utils/log";
import { sendResponse } from "../utils/discordMessage";
import { success, warning } from "../embeds/response";

export default class gamestats extends SlashCommand {
  constructor(creator: any) {
    super(creator, gamestatsCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;

    const gamestatsSetting = await isRunning(ctx.guildID);

    if (ctx.options.stop) {
      if (!gamestatsSetting) {
        sendResponse(
          ctx.channelID,
          { embed: warning("Nothing to stop") },
          msgDeleteTimeout.default
        );
        return;
      }
      await stopGamestats(ctx.guildID);
      sendResponse(
        ctx.channelID,
        { embed: success("Gamestats stoped") },
        msgDeleteTimeout.default
      );
      return;
    }

    if (ctx.options.start) {
      if (gamestatsSetting) {
        sendResponse(
          ctx.channelID,
          {
            embed: warning("Gamestats already running"),
          },
          msgDeleteTimeout.default
        );
        return;
      }

      const channel = (
        (ctx.options.start["channel"] &&
          (await getTextChannel(ctx.options.start["channel"]))) ||
        (await getTextChannel(ctx.channelID))
      ).id;

      await startGamestats(ctx.guildID, channel, 5000);
      return;
    }
    return;
  }
}

const isRunning = async (guildID: string): Promise<gamestatsInfo | null> => {
  const key = redisKey.struct(groupsKey.gameStats, [guildID]);
  const result = await redis.get(key);
  return result;
};

const startGamestats = async (
  guildID: string,
  channelID: string,
  delay: number
) => {
  try {
    const key = redisKey.struct(groupsKey.gameStats, [guildID]);

    const settings = {
      guildID: guildID,
      channelID: channelID,
      delay: delay,
    } as gamestatsInfo;

    await redis.set(key, settings);
    setTimeout(() => null, delay);
    await sendResponse(
      channelID,
      { embed: success("Gamestats started") },
      msgDeleteTimeout.default
    );
    return;
  } catch (error) {
    log(error);
    await sendResponse(
      channelID,
      { embed: error("Gamestats start error") },
      msgDeleteTimeout.default
    );
    return null;
  }
};

const stopGamestats = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.gameStats, [guildID]);
  await redis.del(key);
  return;
};
