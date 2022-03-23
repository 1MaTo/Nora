import { SlashCommandBuilder } from "@discordjs/builders";

export const translateCommand = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate file")
  .addStringOption((option) =>
    option
      .setName("target")
      .setDescription("Result language")
      .setRequired(true)
      .addChoices([
        ["English", "en"],
        ["Russian", "ru"],
      ])
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Link to the discord message with attached .txt file")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("one_drive")
      .setDescription("Link to the google one drive file")
      .setRequired(false)
  )
  .addBooleanOption((option) =>
    option
      .setName("code_file")
      .setDescription("use code sensitive reg exp")
      .setRequired(false)
  );

export default translateCommand;
module.exports = translateCommand;
