import { CacheType, CommandInteraction } from "discord.js";
import { fetchFile } from "../api/translate/fetchFile";
import translateCommand from "../commandData/translate";
import { error } from "../embeds/response";
import { editReply, getMessageById } from "../utils/discordMessage";
import { msgDeleteTimeout, ownerID, production } from "../utils/globals";
import { log } from "../utils/log";

module.exports = {
  data: translateCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;
    await interaction.deferReply();

    const [_, channelId, messageId] = interaction.options
      .getString("message")
      .match(/(\d{1,})/gim);
    const msg = await getMessageById(messageId, channelId);

    if (!msg) {
      await editReply(
        interaction,
        {
          embeds: [error("Can't find this msg") as any],
        },
        msgDeleteTimeout.short
      );
      return;
    }

    const fileUrl = msg.attachments.first()?.url;

    if (!fileUrl) {
      await editReply(
        interaction,
        {
          embeds: [
            error(
              "Can't find attached file, it must be the first attachment is the message"
            ) as any,
          ],
        },
        msgDeleteTimeout.short
      );
      return;
    }

    const file = await fetchFile(fileUrl);

    if (!file) {
      await editReply(
        interaction,
        {
          embeds: [error("Can't get file data, network error") as any],
        },
        msgDeleteTimeout.short
      );
      return;
    }

    const sourceLang = interaction.options.getString("source");
    const targetLang = interaction.options.getString("target");

    await interaction.editReply({
      content: "213123",
    });
    return;
  },
};
