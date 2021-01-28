import { CommandContext, SlashCommand } from "slash-create";
import { lobbyCommand } from "../commandsObjects/lobby";
import { guildIDs, ownerID, production } from "../utils/globals";
import { log } from "../utils/log";
import { updateSlashCommand } from "../utils/updateSlashCommand";

export default class test extends SlashCommand {
  constructor(creator: any) {
    super(creator, {
      name: "test",
      description: "try me",
      guildID: guildIDs.ghostGuild,
      requiredPermissions: ["ADMINISTRATOR"],
      throttling: { usages: 1, duration: 1 },
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;
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
    });
    const config = await searchMapConfigByName("fbt", ctx.guildID); */

    log("sdasd");
    return;
  }
}
