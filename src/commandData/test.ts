import { SlashCommandBuilder } from "@discordjs/builders";

export const testCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export default testCommand;
module.exports = testCommand;
