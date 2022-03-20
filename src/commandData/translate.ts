import { SlashCommandBuilder } from "@discordjs/builders";

export const translateCommand = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate file")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Link to the discord message with attached .txt file")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("target")
      .setDescription("Result language")
      .setRequired(true)
      .addChoices([
        ["Bulgarian", "BG"],
        ["Czech", "CS"],
        ["Danish", "DA"],
        ["German", "DE"],
        ["Greek", "EL"],
        ["English (British)", "EN-GB"],
        ["English (American)", "EN-US"],
        ["Spanish", "ES"],
        ["Estonian", "ET"],
        ["Finnish", "FI"],
        ["French", "FR"],
        ["Hungarian", "HU"],
        ["Italian", "IT"],
        ["Japanese", "JA"],
        ["Lithuanian", "LT"],
        ["Latvian", "LV"],
        ["Dutch", "NL"],
        ["Polish", "PL"],
        [
          "Portuguese (all Portuguese varieties excluding Brazilian Portuguese)",
          "PT-PT",
        ],
        ["Romanian", "RO"],
        ["Russian", "RU"],
        ["Slovak", "SK"],
        ["Slovenian", "SL"],
        ["Swedish", "SV"],
        ["Chinese", "ZH"],
      ])
  )
  .addStringOption((option) =>
    option
      .setName("source")
      .setDescription("Source language")
      .setRequired(false)
      .addChoices([
        ["Bulgarian", "BG"],
        ["Czech", "CS"],
        ["Danish", "DA"],
        ["German", "DE"],
        ["Greek", "EL"],
        ["English", "EN"],
        ["Spanish", "ES"],
        ["Estonian", "ET"],
        ["Finnish", "FI"],
        ["French", "FR"],
        ["Hungarian", "HU"],
        ["Italian", "IT"],
        ["Japanese", "JA"],
        ["Lithuanian", "LT"],
        ["Latvian", "LV"],
        ["Dutch", "NL"],
        ["Polish", "PL"],
        ["Portuguese (all Portuguese varieties mixed)", "PT"],
        ["Romanian", "RO"],
        ["Russian", "RU"],
        ["Slovak", "SK"],
        ["Slovenian", "SL"],
        ["Swedish", "SV"],
        ["Chinese", "ZH"],
      ])
  );

export default translateCommand;
module.exports = translateCommand;
