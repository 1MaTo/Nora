import { SlashCommandBuilder } from "@discordjs/builders";

export const uploadCommand = new SlashCommandBuilder()
  .setName("upload")
  .setDescription("upload map to ghost (up to 1gb)")
  .addStringOption((option) =>
    option
      .setName("link")
      .setDescription("link to map (google drive or source link only)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("file_name")
      .setDescription("override map file name")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("config_name")
      .setDescription("config name for this map")
      .setRequired(false)
  );

export default uploadCommand;
module.exports = uploadCommand;
