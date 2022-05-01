import { ButtonInteraction, MessageActionRow } from "discord.js";
import { hostGameButtonDefault } from "../../components/buttons/hostGame";
import { refreshWatcherButtonDefault } from "../../components/buttons/refreshWatcher";
import { showConfigSelectorButtonDefault } from "../../components/buttons/showConfigSelector";
import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { buttonId } from "../../utils/globals";

module.exports = {
  id: buttonId.refreshWatcher,
  async execute(interaction: ButtonInteraction) {
    await interaction.update({
      components: [
        new MessageActionRow().addComponents(
          hostGameButtonDefault({ disabled: true }),
          showConfigSelectorButtonDefault({ disabled: true }),
          refreshWatcherButtonDefault()
        ),
      ],
    });

    const settingsKey = redisKey.struct(groupsKey.lobbyWatcher, [
      interaction.guildId,
    ]);
    const settings = (await redis.get(settingsKey)) as lobbyWatcherInfo;

    await redis.set(settingsKey, {
      ...settings,
      paused: false,
      forceUpdate: true,
    } as lobbyWatcherInfo);
  },
};
