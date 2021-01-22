import { SlashCommand, CommandOptionType, CommandContext } from "slash-create";
import { log } from "../utils/log";

module.exports = class test extends (
  SlashCommand
) {
  constructor(creator: any) {
    super(creator, {
      name: "test",
      description: "try me",
      guildID: "408947483763277825",
      options: [
        {
          type: CommandOptionType.STRING,
          name: "one",
          description: "Choose me!",
          required: false,
        },
        {
          type: CommandOptionType.USER,
          name: "two",
          description: "No, choose me please!",
          required: false,
        },
      ],
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }
  async run(ctx: CommandContext) {
    log(ctx);
    return "lol";
  }
};
