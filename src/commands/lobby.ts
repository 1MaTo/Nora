import { CommandContext, SlashCommand } from "slash-create";
import { lobbyCommand } from "../commandsObjects/lobby";
import { header } from "../embeds/lobby";
import { success, warning } from "../embeds/response";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { getTextChannel } from "../utils/discordChannel";
import { sendResponse } from "../utils/discordMessage";
import { botStatusInfo } from "../utils/events";
import {
  botStatusVariables,
  msgDeleteTimeout,
  ownerID,
  production,
} from "../utils/globals";
import { log } from "../utils/log";
import { getPassedTime } from "../utils/timePassed";
import { lobbyWatcherUpdater } from "../utils/timerFuncs";

export default class lobby extends SlashCommand {
  constructor(creator: any) {
    super(creator, lobbyCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;

    const lobbyInfo = await isRunning(ctx.guildID);

    if (ctx.options.stop) {
      if (lobbyInfo) {
        await stopLobbyWatcher(ctx.guildID);
        await sendResponse(
          ctx.channelID,
          {
            embed: success("Lobby watcher stoped"),
          },
          msgDeleteTimeout.default
        );
        return;
      }
      await sendResponse(
        ctx.channelID,
        {
          embed: warning("Lobby watcher isn't running on this server"),
        },
        msgDeleteTimeout.default
      );
      return;
    }

    if (lobbyInfo) {
      await sendResponse(
        ctx.channelID,
        {
          embed: warning("Lobby watcher is already running on this server"),
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

    const delay = ctx.options.start["delay"] || 10000;

    startLobbyWatcher(ctx.guildID, channel, delay);
    return;
  }
}

const isRunning = async (guildID: string): Promise<lobbyWatcherInfo | null> => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const result = await redis.get(key);
  return result;
};

const stopLobbyWatcher = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  if (settings) {
    const channel = await getTextChannel(settings.channelID);
    const lobbiesToMsgID = settings.lobbysID.reduce(
      (arr, curr) => [...arr, curr.messageID],
      []
    );
    await channel.bulkDelete([settings.headerID, ...lobbiesToMsgID]);
  }
  await redis.del(key);
  return;
};

const startLobbyWatcher = async (
  guildID: string,
  channelID: string,
  delay: number
) => {
  try {
    const startTime = Date.now();
    const headerMsg = await sendResponse(channelID, {
      embed: header(0, getPassedTime(startTime, Date.now())),
    });
    const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);

    redis.set(key, {
      startTime: startTime,
      channelID: channelID,
      guildID: guildID,
      delay: delay,
      headerID: headerMsg.id,
      lobbysID: [],
    } as lobbyWatcherInfo);

    await sendResponse(
      channelID,
      { embed: success(`Lobby watcher started`) },
      msgDeleteTimeout.default
    );
    setTimeout(() => lobbyWatcherUpdater(guildID), delay);
  } catch (error) {
    log(error);

    await sendResponse(channelID, {
      embed: error(
        `Failed to start lobby watcher\n${error.message}`,
        msgDeleteTimeout.default
      ),
    });
  }
};
