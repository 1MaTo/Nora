import { SlashCommandBuilder } from "@discordjs/builders";

export const logsCommand = new SlashCommandBuilder()
  .setName("logs")
  .setDescription("Get command logs for last commands used")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("some string to filter logs")
      .setRequired(false)
  );

export default logsCommand;
module.exports = logsCommand;
