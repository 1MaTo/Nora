import { CommandContext, SlashCommand } from "slash-create";
import { creator } from "../bot";
import { ghostCommand } from "../commandsObjects/ghost";
import { guildIDs } from "../utils/globals";
import { log } from "../utils/log";
import { updateSlashCommand } from "../utils/updateSlashCommand";

export default class test extends SlashCommand {
  constructor(creator: any) {
    super(creator, {
      name: "test",
      description: "try me",
      guildID: "408947483763277825",
      requiredPermissions: ["ADMINISTRATOR"],
      throttling: { usages: 1, duration: 1 },
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }
  async onError(error: Error, ctx: CommandContext) {
    log(error.message);
    return false;
  }
  async run(ctx: CommandContext) {
    //const guild = await this.creator.api.getCommands("408947483763277825");
    //log(guild);
    //sendResponse(ctx.channelID, "Hey");
    updateSlashCommand(guildIDs.ghostGuild, ghostCommand);
    log(creator.commands.array());
  }
}
