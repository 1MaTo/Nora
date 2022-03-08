import { SlashCommandBuilder } from "@discordjs/builders";

export const statsCommand = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Statistic")
  .addSubcommand((command) =>
    command
      .setName("totalgames")
      .setDescription("Show all games you played on bot with sorting by maps")
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription(
            "Nickname to check, leave empty to check your binded nickname"
          )
          .setRequired(false)
      )
  )
  .addSubcommand((command) =>
    command
      .setName("winrate")
      .setDescription("Show your winrate statistic")
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription(
            "Nickname to check, leave empty to check your binded nickname"
          )
          .setRequired(false)
      )
  )
  .addSubcommand((command) =>
    command.setName("damage").setDescription("Leaderboard by damage")
  );

export default statsCommand;
module.exports = statsCommand;
