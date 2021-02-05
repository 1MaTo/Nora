import { CommandOptionType, SlashCommandOptions } from "slash-create";
import { guildIDs } from "../utils/globals";

export const nicknameCommand = {
  name: "nick",
  description: "Nickname commands",
  guildID: guildIDs.ghostGuild,
  options: [
    {
      name: "bind",
      description: "Bind nickname to your discord account",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "nickname",
          description: "Nick to bind",
          type: CommandOptionType.STRING,
          required: true,
        },
      ],
    },
    {
      name: "unbind",
      description: "Unbind nickname from your discord account",
      type: CommandOptionType.SUB_COMMAND,
    },
    {
      name: "show",
      description: "Show binded nickname",
      type: CommandOptionType.SUB_COMMAND,
    },
    {
      name: "rebind",
      description: "[ADMIN] Rebind nickname from one user to another",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "nickname",
          description: "nick to rebind",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: "user",
          description: "user to bind nickname to",
          type: CommandOptionType.USER,
          required: true,
        },
      ],
    },
    {
      name: "ping_on_start",
      description: "If true - you will get pinged after game start",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "value",
          description: "If true - you will get pinged after game start",
          type: CommandOptionType.BOOLEAN,
          required: true,
        },
      ],
    },
  ],
} as SlashCommandOptions;
