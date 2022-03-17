import { CacheType, CommandInteraction } from "discord.js";
import testCommand from "../commandData/test";
import { clearLobbyGame } from "../db/queries";
import { ownerID } from "../utils/globals";

module.exports = {
  data: testCommand,
  async execute(interaction: CommandInteraction<CacheType>) {
    if (interaction.user.id !== ownerID)
      return interaction.reply({
        ephemeral: true,
        content: "You cant user this command",
      });

    await interaction.deferReply();

    /* const key = redisKey.struct(groupsKey.lobbyGameWatcher, [
      interaction.guildId,
      interaction.channelId,
      "2",
    ]);
    const lobbyGameWatcher = await redis.get(key);
    log(lobbyGameWatcher); */

    clearLobbyGame(2);

    await interaction.editReply({
      content: "sda",
    });
    return;
  },
};
