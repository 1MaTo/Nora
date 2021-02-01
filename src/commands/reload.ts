import { CommandContext, SlashCommand } from "slash-create";
import { reloadCommand } from "../commandsObjects/reload";
import { changeBotStatus } from "../utils/botStatus";
import { ownerID } from "../utils/globals";
import { reloadBot } from "../utils/reloadBot";
import { report } from "../utils/reportToOwner";

export default class reload extends SlashCommand {
  constructor(creator: any) {
    super(creator, reloadCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (ctx.member.id !== ownerID) return;

    changeBotStatus("🔄 Reboot 🔄");

    reloadBot(ctx.options["update"] as boolean);
    return;
  }
}
