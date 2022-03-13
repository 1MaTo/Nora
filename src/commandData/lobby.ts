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
          .addChoice("1 second", 1000)
          .addChoice("2 seconds", 2000)
          .addChoice("3 seconds", 3000)
          .addChoice("4 seconds", 4000)
          .addChoice("5 seconds", 5000)
      )
  )
  .addSubcommand((command) =>
    command.setName("stop").setDescription("stop lobby watcher")
  );

export default lobbyCommand;
module.exports = lobbyCommand;
