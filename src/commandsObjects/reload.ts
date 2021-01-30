import { CommandOptionType, SlashCommandOptions } from "slash-create";

export const reloadCommand = {
  name: "reload",
  description: "reload bot (OWNER COMMAND)",
  options: [
    {
      name: "update",
      description: "update before restart?",
      type: CommandOptionType.BOOLEAN,
      required: true,
    },
  ],
} as SlashCommandOptions;
