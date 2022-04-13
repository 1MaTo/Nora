import { CacheType, CommandInteraction, MessageAttachment } from "discord.js";
import { generateReportFileData } from "../api/commands/report/generateReportFileData";
import reportCommand from "../commandData/report";
import { sendReply } from "../utils/discordMessage";

module.exports = {
  data: reportCommand,
  ownerOnly: true,
  async execute(interaction: CommandInteraction<CacheType>) {
    const { file, fileName } = await generateReportFileData();

    /* const user = await client.users.fetch(interaction.user.id); */

    await interaction.user.send({
      files: [new MessageAttachment(file, fileName)],
    });

    await sendReply(interaction, { content: "complete", ephemeral: true });
  },
};
