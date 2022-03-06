import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, Interaction } from "discord.js";
import { testCommand } from "../commandsObjects/test";

export default {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    await interaction.reply("Pong!");
  },
};
