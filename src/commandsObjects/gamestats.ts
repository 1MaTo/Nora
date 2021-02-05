import { CommandOptionType, SlashCommandOptions } from "slash-create";
import { guildIDs } from "../utils/globals";

export const gamestatsCommand = {
  name: "gamestats",
  description: "Stats collecting after game",
  guildID: guildIDs.ghostGuild,
  requiredPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "start",
      description: "Start collecting stats",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "channel",
          description: "Channel to send messages",
          type: CommandOptionType.CHANNEL,
        },
      ],
    },
    {
      name: "stop",
      description: "Stop collecting stats",
      type: CommandOptionType.SUB_COMMAND,
    },
  ],
} as SlashCommandOptions;
