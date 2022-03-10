import { codeBlock } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { googleDriveApiKey } from "../auth.json";
import testCommand from "../commandData/test";
import { warning } from "../embeds/response";
import { downloadFile } from "../utils/downloadFile";
import { ownerID } from "../utils/globals";
import { uploadMapToGhost } from "../utils/requestToGuiServer";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (interaction.user.id !== ownerID)
      return interaction.reply({
        ephemeral: true,
        content: "You cant user this command",
      });

    interaction.deferReply();

    const link =
      "https://drive.google.com/file/d/1DgFz5scMUSFas3bTHmiF6v2icnbR0a74/view";
    const fileName = "map.w3x";

    const isGoogleDriveLink = new RegExp(
      "https://drive.google.com/file/d/",
      "i"
    ).test(link);
    const isSourceLink = new RegExp(".w3x$").test(link);

    if (!isGoogleDriveLink && !isSourceLink)
      return interaction.editReply({
        embeds: [
          warning(
            `Link must be ${codeBlock(
              "google drive link (drive.google.com/file/d/...)"
            )} or ${codeBlock(`source link (ends like this - mapName.w3x)`)}`
          ) as any,
        ],
      });

    if (new RegExp("https://drive.google.com/file/d/", "i").test(link)) {
      const docId = link.match(/d\/[^\/]*\//g)[0].replace(/(d\/|\/)/g, "");
      const fileDownloaded = await downloadFile(
        `https://www.googleapis.com/drive/v3/files/${docId}?alt=media&key=${googleDriveApiKey}`,
        fileName.replace(/\.w3x$/g, "")
      );

      if (fileDownloaded) {
        await uploadMapToGhost(fileName.replace(/\.w3x$/g, ""), fileName);
      }
    }

    interaction.editReply({
      content: "...",
    });
    return;
  },
};
