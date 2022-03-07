import { SlashCommandBuilder } from "@discordjs/builders";

export const mapconfigCommand = new SlashCommandBuilder()
  .setName("mapconfig")
  .setDescription("Commands to work with map configs")
  .addSubcommand((command) =>
    command
      .setName("create")
      .setDescription("create new map config")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription(
            "Name for map config is also a pattern that used to search config for maps"
          )
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("slots")
          .setDescription("Max slots in map (comp slots not included)")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("teams")
          .setDescription(
            "Pattern (team name,slot count): Team 1,4|Team 2,4|Spectators|2"
          )
          .setRequired(true)
      )
  )
  .addSubcommand((command) =>
    command
      .setName("show")
      .setDescription("Show map config list or search specific one")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("Enter name to search map config")
          .setRequired(false)
      )
  )
  .addSubcommand((command) =>
    command
      .setName("delete")
      .setDescription("Delete map config")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("Config name to delte")
          .setRequired(true)
      )
  );

export default mapconfigCommand;
module.exports = mapconfigCommand;
