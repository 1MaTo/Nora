import axios from "axios";
import { CacheType, CommandInteraction } from "discord.js";
import { googleDriveApiKey } from "../auth.json";
import uploadCommand from "../commandData/upload";
import { error, success, warning } from "../embeds/response";
import { editReply } from "../utils/discordMessage";
import { downloadFile } from "../utils/downloadFile";
import { msgDeleteTimeout, ownerID, production } from "../utils/globals";
import { log } from "../utils/log";
import { uploadMapToGhost } from "../utils/requestToGuiServer";

module.exports = {
  data: uploadCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (!production && interaction.member.user.id !== ownerID) return;
    await interaction.deferReply();

    let mapLink = interaction.options.getString("link");
    let fileName = interaction.options.getString("file_name");
    let configName =
      interaction.options.getString("config_name") ||
      (fileName && fileName.replace(/\.w3x$/g, ""));

    if (fileName && !/.w3x$/.test(fileName)) {
      fileName = fileName + ".w3x";
    }

    const isGoogleDriveLink = new RegExp(
      "https://drive.google.com/file/d/",
      "i"
    ).test(mapLink);

    const isSourceLink = /[^\/]*.w3x$/.test(mapLink);

    if (!isGoogleDriveLink && !isSourceLink)
      return await editReply(
        interaction,
        {
          embeds: [
            warning(
              `Link must be \ngoogle drive link (drive.google.com/file/d/...)\nor\nsource link (ends like this - .../mapName.w3x)`
            ) as any,
          ],
        },
        msgDeleteTimeout.long
      );

    if (isGoogleDriveLink) {
      const docId = mapLink.match(/d\/[^\/]*\//g)[0].replace(/(d\/|\/)/g, "");
      const googleDriveName = await getGoogeDriveFileName(
        `https://www.googleapis.com/drive/v3/files/${docId}?&key=${googleDriveApiKey}`
      );

      if (googleDriveName && !/.w3x$/.test(googleDriveName)) {
        return await editReply(
          interaction,
          {
            embeds: [warning(`This file has not .w3x extension`) as any],
          },
          msgDeleteTimeout.short
        );
      }

      fileName = fileName || googleDriveName || "uknown_map";
      mapLink = `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=${googleDriveApiKey}`;
    }

    if (isSourceLink) {
      const fileNameFromLink = mapLink.match(/[^\/]*.w3x$/);
      fileName =
        fileName || fileNameFromLink ? fileNameFromLink[0] : "uknown_map";
    }

    configName = configName || fileName.replace(/\.w3x$/g, "");

    const fileDownloaded = await downloadFile(
      mapLink,
      fileName.replace(/\.w3x$/g, "")
    );

    if (!fileDownloaded) {
      return await editReply(
        interaction,
        {
          embeds: [error(`Cant download file from link`) as any],
        },
        msgDeleteTimeout.short
      );
    }

    const fileUploaded = await uploadMapToGhost(
      fileName.replace(/\.w3x$/g, ""),
      fileName
    );

    if (!fileUploaded) {
      return await editReply(
        interaction,
        {
          embeds: [error(`Cant upload file to ghost`) as any],
        },
        msgDeleteTimeout.short
      );
    }

    return await editReply(
      interaction,
      {
        embeds: [
          success(
            `Map "${fileName}" with config "${configName}" uploaded`
          ) as any,
        ],
      },
      msgDeleteTimeout.short
    );
  },
};

const getGoogeDriveFileName = async (url: string) => {
  try {
    const googleFileResponse = await axios.get(url);
    return googleFileResponse.data.name as string;
  } catch (error) {
    log("[getting google drive file name] cant get name");
    return false;
  }
};
