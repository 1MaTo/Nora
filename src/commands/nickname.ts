import { CommandContext, SlashCommand } from "slash-create";
import { nicknameCommand } from "../commandsObjects/nickname";
import { getNicknames } from "../db/queries";
import { error, info, success, warning } from "../embeds/response";
import { groupsKey, keyDivider, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { sendResponse } from "../utils/discordMessage";
import { getMember } from "../utils/discordUser";
import { msgDeleteTimeout, ownerID, production } from "../utils/globals";
import { log } from "../utils/log";

export default class nickname extends SlashCommand {
  constructor(creator: any) {
    super(creator, nicknameCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;

    if (ctx.options.bind) {
      const nick = ctx.options.bind["nickname"];
      const isFree = await freeNickname(nick, ctx.guildID);

      if (!isFree) {
        const nicks = await getNicknames();
        const member = await getMember(ctx.guildID, ctx.member.id);
        await member.send({
          embed: info(
            `ALL AVAILABLE NICKNAMES\n----------------------\n${nicks.join(
              "\n"
            )}`
          ),
        });

        await sendResponse(
          ctx.channelID,
          { embed: warning(`Bad nickname`) },
          msgDeleteTimeout.default
        );
        return;
      }

      if (typeof isFree === "string") {
        const member = await getMember(ctx.guildID, isFree);
        await sendResponse(
          ctx.channelID,
          {
            embed: warning(`This nickname binded to ${member.user.tag}`),
          },
          msgDeleteTimeout.default
        );
        return;
      }

      await bindNickname(nick, ctx.member.id, ctx.guildID);
      await sendResponse(
        ctx.channelID,
        { embed: success(`${nick} binded`) },
        msgDeleteTimeout.default
      );
      return;
    }

    if (ctx.options.unbind) {
      await unbindNickname(ctx.member.id, ctx.guildID);
      await sendResponse(
        ctx.channelID,
        { embed: success(`Nick unbinded`) },
        msgDeleteTimeout.default
      );
      return;
    }

    if (ctx.options.show) {
      const key = redisKey.struct(groupsKey.bindNickname, [
        ctx.guildID,
        ctx.member.id,
      ]);
      const nick = await redis.get(key);
      if (!nick) {
        await sendResponse(
          ctx.channelID,
          {
            embed: warning("Nickname not binded"),
          },
          msgDeleteTimeout.default
        );
        return;
      }
      await sendResponse(
        ctx.channelID,
        { embed: info(`[ ${nick} ]`) },
        msgDeleteTimeout.default
      );
      return;
    }

    const user = await getMember(ctx.guildID, ctx.member.id);
    if (!user.hasPermission("ADMINISTRATOR")) {
      await sendResponse(
        ctx.channelID,
        {
          embed: error("Need to be admin for rebind"),
        },
        msgDeleteTimeout.default
      );
      return;
    }

    if (ctx.options.rebind) {
      const nick = ctx.options.rebind["nickname"];
      const userID = ctx.options.rebind["user"];
      const isFree = await freeNickname(nick, ctx.guildID);

      if (!isFree) {
        await sendResponse(
          ctx.channelID,
          { embed: warning(`Bad nickname`) },
          msgDeleteTimeout.default
        );
        return;
      }

      if (typeof isFree === "string") {
        const member = await getMember(ctx.guildID, isFree);
        await sendResponse(
          ctx.channelID,
          {
            embed: info(`Unbind ${nick} from ${member.user.tag}`),
          },
          msgDeleteTimeout.default
        );
      }

      await bindNickname(nick, userID, ctx.guildID);
      const member = await getMember(ctx.guildID, userID);
      await sendResponse(
        ctx.channelID,
        {
          embed: success(`${nick} binded to ${member.user.tag}`),
        },
        msgDeleteTimeout.default
      );
      return;
    }

    return;
  }
}

const bindNickname = async (
  nickname: string,
  userID: string,
  guildID: string
) => {
  const key = redisKey.struct(groupsKey.bindNickname, [guildID, userID]);
  await redis.set(key, nickname);
  return true;
};

const unbindNickname = async (userID: string, guildID: string) => {
  const key = redisKey.struct(groupsKey.bindNickname, [guildID, userID]);
  await redis.del(key);
  return true;
};

const freeNickname = async (nickname: string, guildID: string) => {
  const nicks = await getNicknames();

  if (!nicks) return null;

  const exist = nicks.some((nick: string) => nick === nickname);

  if (!exist) return null;

  const bindedNicknames = await redis.scanForPattern(
    `${groupsKey.bindNickname}${keyDivider}${guildID}*`
  );

  if (!bindedNicknames) return true;

  const index = bindedNicknames.findIndex(async (key) => {
    const nick = await redis.get(key);
    return nick === nickname;
  });

  if (index !== -1) return redisKey.destruct(bindedNicknames[index])[1];

  return true;
};
