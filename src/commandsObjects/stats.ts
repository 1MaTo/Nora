import { CommandOptionType, SlashCommandOptions } from "slash-create";
import { guildIDs } from "../utils/globals";

export const statsCommand = {
  name: "stats",
  description: "Statistic",
  guildID: guildIDs.ghostGuild,
  options: [
    {
      name: "totalgames",
      description: "Show all games you played on bot with sorting by maps",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "nickname",
          description:
            "Nickname to check, leave empty to check your binded nickname",
          type: CommandOptionType.STRING,
          required: false,
        },
      ],
    },
    /* {
      name: "winrate",
      description: "Show winrate statistic",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "nickname",
          description:
            "Nickname to check, leave empty to check your binded nickname",
          type: CommandOptionType.STRING,
          required: false,
        },
      ],
    }, */
  ],
} as SlashCommandOptions;
