import { SlashCommandBuilder } from "@discordjs/builders";

export const ghostCommand = new SlashCommandBuilder()
  .setName("ghost")
  .setDescription("Send command to ghost")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("pub")
      .setDescription("host game")
      .addStringOption((option) =>
        option.setName("gamename").setDescription("Game name").setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("unhost").setDescription("Unhost game in lobby")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("start")
      .setDescription("Start game in lobby")
      .addBooleanOption((option) =>
        option
          .setName("force")
          .setDescription("Skip checks or not")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("load-map")
      .setDescription("Create config and load it")
      .addStringOption((option) =>
        option.setName("map").setDescription("Map name").setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("select-map")
      .setDescription("Select config from list and load it")
  );

export default ghostCommand;
module.exports = ghostCommand;
