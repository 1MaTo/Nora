import { CacheType, CommandInteraction } from "discord.js";
import { start } from "../api/commands/lobby/start";
import { stop } from "../api/commands/lobby/stop";
import lobbyCommand from "../commandData/lobby";
import { ownerID, production } from "../utils/globals";

module.exports = {
  data: lobbyCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;

    switch (interaction.options.getSubcommand()) {
      case "start":
        await start(interaction);
        return;
      case "stop":
        await stop(interaction);
        return;
      default:
        return await interaction.reply("...");
    }
  },
};
