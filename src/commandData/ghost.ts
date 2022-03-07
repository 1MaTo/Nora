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
      .setName("load")
      .setDescription("Load map config from map")
      .addStringOption((option) =>
        option.setName("name").setDescription("Map name").setRequired(true)
      )
  );

export default ghostCommand;
module.exports = ghostCommand;
