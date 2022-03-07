import { CacheType, CommandInteraction } from "discord.js";
import { testCommand } from "../commandsObjects/test";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    await interaction.reply("Pong!");
  },
};
