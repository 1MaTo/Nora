import { CommandContext, SlashCommand } from "slash-create";
import { guildIDs, ownerID } from "../utils/globals";
import { report } from "../utils/reportToOwner";

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
    //updateSlashCommand(undefined, reloadCommand);
    report("Hi im here and reloaded myself! ...");
    return;
  }
}
