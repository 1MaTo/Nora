import { CacheType, CommandInteraction } from "discord.js";
import testCommand from "../commandData/test";
import { ownerID } from "../utils/globals";
import { getChatLogs } from "../utils/requestToGuiServer";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (interaction.user.id !== ownerID)
      return interaction.reply({
        ephemeral: true,
        content: "You cant user this command",
      });

    await interaction.deferReply();
    /* 
    const [startMark, endMark] = await sendCommand(`unhost`); */

    const logs = await getChatLogs();

    await interaction.editReply({
      content: "",
    });
    return;
  },
};
