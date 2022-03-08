import { CacheType, CommandInteraction } from "discord.js";
import { bind } from "../api/commands/nickname/bind";
import { ping_on_start } from "../api/commands/nickname/ping_on_start";
import { rebind } from "../api/commands/nickname/rebind";
import { show } from "../api/commands/nickname/show";
import { unbind } from "../api/commands/nickname/unbind";
import nicknameCommand from "../commandData/nickname";
import { ownerID, production } from "../utils/globals";

module.exports = {
  data: nicknameCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;

    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case "bind":
        await bind(interaction);
        return;
      case "unbind":
        await unbind(interaction);
        return;
      case "show":
        await show(interaction);
        return;
      case "rebind":
        await rebind(interaction);
        return;
      case "ping_on_start":
        await ping_on_start(interaction);
        return;
      default:
        return await interaction.reply("...");
    }
  },
};
