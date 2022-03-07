import { SlashCommandBuilder } from "@discordjs/builders";

export const lobbyCommand = new SlashCommandBuilder()
  .setName("lobby")
  .setDescription(
    "Checking for lobbies in real time (only one instance per server)"
  )
  .addSubcommand((command) =>
    command
      .setName("start")
      .setDescription("start lobby watcher")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("channel to send messages")
          .setRequired(false)
      )
      .addIntegerOption((option) =>
        option
          .setName("delay")
          .setDescription("updatind interval")
          .setRequired(false)
          .addChoice("5 seconds", 5000)
          .addChoice("10 seconds", 10000)
      )
  )
  .addSubcommand((command) =>
    command.setName("stop").setDescription("stop lobby watcher")
  );

export default lobbyCommand;
module.exports = lobbyCommand;
