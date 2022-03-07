import { SlashCommandBuilder } from "@discordjs/builders";

export const gamestatsCommand = new SlashCommandBuilder()
  .setName("gamestats")
  .setDescription("Stats collecting after game")
  .addSubcommand((command) =>
    command
      .setName("start")
      .setDescription("start collecting stats")
      .addChannelOption((option) =>
        option.setName("channel").setDescription("channel to send messages")
      )
  )
  .addSubcommand((command) =>
    command.setName("stop").setDescription("stop collecting stats")
  );

export default gamestatsCommand;
module.exports = gamestatsCommand;
