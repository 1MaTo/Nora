import { CacheType, CommandInteraction } from "discord.js";
import { getLanguageList } from "../api/yandex/getLanguageList";
import { translateYandex } from "../api/yandex/translateYandex";
import testCommand from "../commandData/test";
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

    const text = [
      "水银灯 ",
      "黑翼降临",
      "学习黑翼降临",
      "等级 %d",
      "立即移动至目标区域中心处",
      "并对该区域内的敌方单位造成一定的伤害与2秒眩晕。",
      "对不可通行地面施放将无效化。",
      "技能类型：",
      "区域目标",
      "伤害数值：",
      "倍智力）X技能等级",
      "伤害类型：",
      "法术伤害",
      "暗属性",
      "施法距离：",
      "冷却时间：",
      "秒",
      "等级 1",
      "等级 2 |",
    ];

    //const translate = await translateYandex({})

    const translated = await translateYandex({
      targetLanguageCode: "en",
      texts: text,
    });
    log(translated);

    await interaction.editReply({
      content: "sda",
    });
    return;
  },
};
