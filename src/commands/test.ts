import { CacheType, CommandInteraction } from "discord.js";
import { pubGame } from "../api/ghost/pubGame";
import testCommand from "../commandData/test";
import { ghostCommandsMarks, ownerID } from "../utils/globals";
import { log } from "../utils/log";
import { getChatLogs, sendCommand } from "../utils/requestToGuiServer";
import { sleep } from "../utils/sleep";
import util from "node:util";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (interaction.user.id !== ownerID)
      return interaction.reply({
        ephemeral: true,
        content: "You cant user this command",
      });

    await interaction.deferReply();

    const [startMark, endMark] = await sendCommand(`unhost`);

    const logs = await getChatLogs();

    await interaction.editReply({
      content: "",
    });
    return;
  },
};
