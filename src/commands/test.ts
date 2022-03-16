import { CacheType, CommandInteraction } from "discord.js";
import { pauseLobbyWatcher } from "../api/lobbyWatcher/pauseLobbyWatcher";
import testCommand from "../commandData/test";
import { clearLobbyGame } from "../db/queries";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { ownerID } from "../utils/globals";
import { log } from "../utils/log";

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
