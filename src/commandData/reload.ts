import { SlashCommandBuilder } from "@discordjs/builders";

export const reloadCommand = new SlashCommandBuilder()
  .setName("reload")
  .setDescription("reload bot (OWNER COMMAND)")
  .addBooleanOption((option) =>
    option
      .setName("update")
      .setDescription("Update before restart?")
      .setRequired(true)
  );

export default reloadCommand;
module.exports = reloadCommand;
