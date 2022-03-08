import { CacheType, CommandInteraction } from "discord.js";
import { reloadBot } from "../api/reload/reload";
import reloadCommand from "../commandData/reload";
import { changeBotStatus } from "../utils/botStatus";
import { ownerID } from "../utils/globals";

module.exports = {
  data: reloadCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (interaction.user.id !== ownerID) {
      await interaction.reply("Your are not my sempai!");
      return;
    }

    await changeBotStatus("🔄 Reboot 🔄");
    await interaction.reply({ content: "Going on reload", ephemeral: true });

    reloadBot(interaction.options.getBoolean("update"));
  },
};
