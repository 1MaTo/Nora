import { SlashCommandBuilder } from "discord.js";

import type { Command } from "./shared/type.ts";

export default {
  info: new SlashCommandBuilder().setName("debug").setDescription("debug"),
  call: async (interaction) => {
    await interaction.reply("debug");
  },
} satisfies Command;
