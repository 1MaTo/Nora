import { SlashCommandBuilder } from "@discordjs/builders";

export const reportCommand = new SlashCommandBuilder()
  .setName("report")
  .setDescription("report logs to owner");

export default reportCommand;
module.exports = reportCommand;
