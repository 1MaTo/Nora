import { CacheType, CommandInteraction, MessageAttachment } from "discord.js";
import { getGoogleDriveLinkData } from "../api/googleDrive/getGoogleDriveLinkData";
import { fetchFile } from "../api/translate/fetchFile";
import { getMessageArray } from "../api/translate/getMessageArray";
import { replaceStringsInFile } from "../api/translate/replaceStringsInFile";
import { translateAllItems } from "../api/translate/translateAllItems";
import { zipString } from "../api/zip/zipString";
import translateCommand from "../commandData/translate";
import { error } from "../embeds/response";
import { editReply, getMessageById } from "../utils/discordMessage";
import { formatBytes } from "../utils/formatBytes";
import { msgDeleteTimeout, ownerID, production } from "../utils/globals";
import { log } from "../utils/log";

module.exports = {
  data: translateCommand,
  ownerOnly: true,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;

    if (interaction.user.id !== ownerID) {
      await interaction.reply("Your are not my sempai!");
      return;
    }

    await interaction.deferReply();

    let fileUrl = "";
    let fileName = "translated_file.txt";

    const fromMessage = interaction.options
      .getString("message")
      ?.match(/(\d{1,})/gim);

    const oneDriveLink = interaction.options.getString("one_drive");

    if (!fromMessage && !oneDriveLink) {
      await editReply(
        interaction,
        {
          embeds: [error("No links provided") as any],
        },
        msgDeleteTimeout.short
      );
      return;
    }

    if (fromMessage) {
      const [_, channelId, messageId] = fromMessage;
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

      fileUrl = msg.attachments.first()?.url;

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

      fileName = msg.attachments.first()?.name;
    }

    if (oneDriveLink) {
      const data = await getGoogleDriveLinkData(oneDriveLink);
      if (!data) {
        await editReply(
          interaction,
          {
            embeds: [error("Bad one drive link") as any],
          },
          msgDeleteTimeout.short
        );
        return;
      }
      fileName = data.fileName || fileName;
      fileUrl = data.fileUrl;
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

    const messageArray = getMessageArray(
      file,
      interaction.options.getBoolean("code_file")
    );

    //log(messageArray.itemList, messageArray.str);

    if (!messageArray) {
      await editReply(
        interaction,
        {
          embeds: [error("Nothing to translate") as any],
        },
        msgDeleteTimeout.short
      );
      return;
    }

    /* await interaction.editReply({
      content: fileName,
    });

    return; */

    const targetLang = interaction.options.getString("target");

    const translatedStrings = await translateAllItems(
      messageArray,
      targetLang as YandexLanguageCodeList
    );
    const translatedFileData = replaceStringsInFile(
      messageArray.str,
      translatedStrings,
      false,
      interaction.options.getBoolean("code_file")
    );

    let readyToSendFile = Buffer.from(translatedFileData, "utf-8");

    log("file length", formatBytes(readyToSendFile.length));

    //  More than 7.9 MB
    if (readyToSendFile.length > 8283750) {
      readyToSendFile = Buffer.from(
        await zipString(fileName, translatedFileData)
      );
      fileName = fileName.replace(".txt", ".zip");
      log("zip file length", formatBytes(readyToSendFile.length));
    }

    await interaction.editReply({
      files: [new MessageAttachment(readyToSendFile, fileName)],
    });
    return;
  },
};
