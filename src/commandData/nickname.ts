import { SlashCommandBuilder } from "@discordjs/builders";

export const nicknameCommand = new SlashCommandBuilder()
  .setName("nick")
  .setDescription("Nickname commands")
  .addSubcommand((command) =>
    command
      .setName("bind")
      .setDescription("Bind nickname to your discord account")
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription("Nick to bind")
          .setRequired(true)
      )
  )
  .addSubcommand((command) =>
    command
      .setName("unbind")
      .setDescription("Unbind nickname from your discord account")
  )
  .addSubcommand((command) =>
    command.setName("show").setDescription("Show binded nickname")
  )
  .addSubcommand((command) =>
    command
      .setName("rebind")
      .setDescription("[ADMIN] Rebind nickname from one user to another")
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription("nick to rebind")
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("user to bind nickname to")
          .setRequired(true)
      )
  )
  .addSubcommand((command) =>
    command
      .setName("ping_on_start")
      .setDescription("If true - you will get pinged after game start")
      .addBooleanOption((option) =>
        option
          .setName("value")
          .setDescription("If true - you will get pinged after game start")
          .setRequired(true)
      )
  );

export default nicknameCommand;
module.exports = nicknameCommand;
