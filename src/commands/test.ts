import { CommandContext, SlashCommand } from "slash-create";
import { gamestatsCommand } from "../commandsObjects/gamestats";
import { ghostCommand } from "../commandsObjects/ghost";
import { nicknameCommand } from "../commandsObjects/nickname";
import { statsCommand } from "../commandsObjects/stats";
import { groupsKey, keyDivider, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { sendResponse } from "../utils/discordMessage";
import { guildIDs, ownerID } from "../utils/globals";
import { log } from "../utils/log";
import { getDiscordUsersFromNicknames } from "../utils/nicknameToDiscordUser";
import { report } from "../utils/reportToOwner";
import { updateSlashCommand } from "../utils/updateSlashCommand";

export default class test extends SlashCommand {
  constructor(creator: any) {
    super(creator, {
      name: "test",
      description: "try me",
      guildID: guildIDs.ghostGuild,
      throttling: { usages: 1, duration: 1 },
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (ctx.member.id !== ownerID) return;
    //const guild = await this.creator.api.getCommands("408947483763277825");
    //log(guild);
    //sendResponse(ctx.channelID, "Hey");
    //updateSlashCommand(guildIDs.ghostGuild, lobbyCommand);

    /* await deleteMapConfig(ctx.guildID, "fbt");
    await createOrUpdateMapConfig(ctx.guildID, {
      guildID: ctx.guildID,
      name: "fbt",
      slotMap: [
        { name: "Team 1", slots: 4 },
        { name: "Team 2", slots: 4 },
        { name: "Spectators", slots: 2 },
      ],
      options: undefined,
      slots: 10,
    });*/

    /* const configOne = await searchMapConfigByName("fbt", ctx.guildID);
    const configTwo = await searchMapConfigByMapName("FBT 169", ctx.guildID);

    log(configOne, configTwo); */
    //updateSlashCommand(guildIDs.ghostGuild, ghostCommand);
    //report("Hi im here and reloaded myself! NICE");

    /*   await Promise.all(
      usersIDs.map(async (id) => await sendResponse(ctx.channelID, `<@${id}>`))
    ); */

    const keys = await redis.scanForPattern(
      `${groupsKey.bindNickname}${keyDivider}${ctx.guildID}*`
    );

    await Promise.all(
      keys.map(async (key) => {
        const old = await redis.get(key);
        await redis.set(key, {
          nickname: old,
          discordID: redisKey.destruct(key)[1],
          settings: {},
        } as userData);
      })
    );

    const users = await getDiscordUsersFromNicknames(["IMaToI"], ctx.guildID);
    log(users);
    return;
  }
}
