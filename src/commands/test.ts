import { CommandContext, SlashCommand } from "slash-create";
import { log } from "../utils/log";

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
    log(ctx.options);
    //sendResponse(ctx.channelID, "Hey");
  }
}
