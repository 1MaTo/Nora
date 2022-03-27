import { CacheType, CommandInteraction } from "discord.js";
import { getGoogeDriveFileName } from "../api/googleDrive/getGoogeDriveFileName";
import { googleDriveApiKey } from "../auth.json";
import uploadCommand from "../commandData/upload";
import { error, success, warning } from "../embeds/response";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
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

    const key = redisKey.struct(groupsKey.uploadingMap, [interaction.guildId]);
    const userUploading = await redis.get(key);

    if (userUploading) {
      return await editReply(
        interaction,
        {
          embeds: [
            warning(
              `${userUploading} already uploading map, wait until it's done`
            ) as any,
          ],
        },
        msgDeleteTimeout.short
      );
    }

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
      const validMatches = mapLink.match(/d\/[^\/]*\/*/g);

      if (!validMatches) {
        return await editReply(
          interaction,
          {
            embeds: [warning(`Can't read this link`) as any],
          },
          msgDeleteTimeout.long
        );
      }

      const docId = validMatches[0].replace(/(d\/|\/)/g, "");
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

    await redis.set(key, interaction.user.tag);

    const fileDownloaded = await downloadFile(
      mapLink,
      fileName.replace(/\.w3x$/g, "")
    );

    if (!fileDownloaded) {
      await redis.del(key);
      return await editReply(
        interaction,
        {
          embeds: [error(`Cant download file from link`) as any],
        },
        msgDeleteTimeout.short
      );
    }

    const fileUploaded = await uploadMapToGhost(
      configName.replace(/\.w3x$/g, ""),
      fileName
    );

    if (!fileUploaded) {
      await redis.del(key);
      return await editReply(
        interaction,
        {
          embeds: [error(`Cant upload file to ghost`) as any],
        },
        msgDeleteTimeout.short
      );
    }

    await redis.del(key);
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
