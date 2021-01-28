import { CommandOptionType, SlashCommandOptions } from "slash-create";
import { guildIDs } from "../utils/globals";

export const lobbyCommand = {
  name: "lobby",
  description:
    "Checking for lobbies in real time (only one instance per server)",
  guildID: guildIDs.ghostGuild,
  options: [
    {
      name: "start",
      description: "start lobby watcher",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "channel",
          description: "channel to send messages",
          required: false,
          type: CommandOptionType.CHANNEL,
        },
        {
          name: "delay",
          description: "Updatind interval",
          type: CommandOptionType.INTEGER,
          required: false,
          choices: [
            { name: "5 seconds", value: 5000 },
            { name: "10 seconds", value: 10000 },
          ],
        },
      ],
    },
    {
      name: "stop",
      description: "stop lobby watcher",
      type: CommandOptionType.SUB_COMMAND,
    },
  ],
} as SlashCommandOptions;
