import { CacheType, CommandInteraction } from "discord.js";
import testCommand from "../commandData/test";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    await interaction.reply("Pong!");
    return;
  },
};
