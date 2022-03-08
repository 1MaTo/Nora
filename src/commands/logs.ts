import { Embed } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { getCommandLogs } from "../api/logs/getCommandLogs";
import logsCommand from "../commandData/logs";
import { warning } from "../embeds/response";
import { editReply } from "../utils/discordMessage";
import { msgDeleteTimeout } from "../utils/globals";

module.exports = {
  data: logsCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!interaction.memberPermissions.has("ADMINISTRATOR"))
      return interaction.reply({
        embeds: [warning("This command only for admins") as any],
        ephemeral: true,
      });

    await interaction.deferReply();

    const logs = await getCommandLogs(
      interaction.guildId,
      interaction.options.getString("query")
    );

    await editReply(
      interaction,
      {
        embeds: [
          new Embed()
            .setTitle(
              `Commands log${
                interaction.options.getString("query")
                  ? ` | ${interaction.options.getString("query")}`
                  : ""
              }`
            )
            .setDescription(
              logs.length !== 0 ? logs.join("\n") : "no logs found..."
            ),
        ],
      },
      msgDeleteTimeout.long
    );
  },
};
