import { CommandOptionType, SlashCommandOptions } from "slash-create";
import { guildIDs } from "../utils/globals";

export const mapconfigCommand = {
  name: "config",
  description: "Commands to work with map configs",
  guildID: guildIDs.ghostGuild,
  options: [
    {
      name: "create",
      description: "create new map config",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "name",
          type: CommandOptionType.STRING,
          description:
            "Name for map config is also a pattern that used to search config for maps",
          required: true,
        },
        {
          name: "slots",
          type: CommandOptionType.INTEGER,
          description: "Max slots in map (comp slots not included)",
          required: true,
        },
        {
          name: "teams",
          type: CommandOptionType.STRING,
          description:
            "Pattern (team name,slot count): Team 1,4|Team 2,4|Spectators|2",
          required: true,
        },
      ],
    },
    {
      name: "update",
      description: "Update config options",
      type: CommandOptionType.SUB_COMMAND_GROUP,
      options: [
        {
          name: "spectators",
          description:
            "Whether to include spectators as players or not (used in notifications)",
          type: CommandOptionType.SUB_COMMAND,
          options: [
            {
              name: "name",
              description: "Config name",
              type: CommandOptionType.STRING,
              required: true,
            },
            {
              name: "status",
              description: "Enable or disable option",
              type: CommandOptionType.BOOLEAN,
              required: true,
            },
          ],
        },
        {
          name: "ranking",
          description: "Whether to calculate winrate for map or not",
          type: CommandOptionType.SUB_COMMAND,
          options: [
            {
              name: "name",
              description: "Config name",
              type: CommandOptionType.STRING,
              required: true,
            },
            {
              name: "status",
              description: "Enable or disable option",
              type: CommandOptionType.BOOLEAN,
              required: true,
            },
          ],
        },
        {
          name: "image",
          description: "Update image for map config",
          type: CommandOptionType.SUB_COMMAND,
          options: [
            {
              name: "name",
              description: "Config name",
              type: CommandOptionType.STRING,
              required: true,
            },
            {
              name: "link",
              description:
                "Past link to image or leave blank for deleting image",
              type: CommandOptionType.STRING,
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "show",
      description: "Show map config list or search specific one",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "name",
          description: "Enter name to search map config",
          type: CommandOptionType.STRING,
          required: false,
        },
      ],
    },
    {
      name: "delete",
      description: "Delete map config",
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: "name",
          description: "Config name to delte",
          type: CommandOptionType.STRING,
          required: true,
        },
      ],
    },
  ],
} as SlashCommandOptions;
