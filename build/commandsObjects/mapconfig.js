"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapconfigCommand = void 0;
const slash_create_1 = require("slash-create");
const globals_1 = require("../utils/globals");
exports.mapconfigCommand = {
    name: "config",
    description: "Commands to work with map configs",
    guildID: globals_1.guildIDs.ghostGuild,
    options: [
        {
            name: "create",
            description: "create new map config",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "name",
                    type: slash_create_1.CommandOptionType.STRING,
                    description: "Name for map config is also a pattern that used to search config for maps",
                    required: true,
                },
                {
                    name: "slots",
                    type: slash_create_1.CommandOptionType.INTEGER,
                    description: "Max slots in map (comp slots not included)",
                    required: true,
                },
                {
                    name: "teams",
                    type: slash_create_1.CommandOptionType.STRING,
                    description: "Pattern (team name,slot count): Team 1,4|Team 2,4|Spectators|2",
                    required: true,
                },
            ],
        },
        {
            name: "update",
            description: "Update config options",
            type: slash_create_1.CommandOptionType.SUB_COMMAND_GROUP,
            options: [
                {
                    name: "spectators",
                    description: "Whether to include spectators as players or not (used in notifications)",
                    type: slash_create_1.CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: "name",
                            description: "Config name",
                            type: slash_create_1.CommandOptionType.STRING,
                            required: true,
                        },
                        {
                            name: "status",
                            description: "Enable or disable option",
                            type: slash_create_1.CommandOptionType.BOOLEAN,
                            required: true,
                        },
                    ],
                },
                {
                    name: "ranking",
                    description: "Whether to calculate winrate for map or not",
                    type: slash_create_1.CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: "name",
                            description: "Config name",
                            type: slash_create_1.CommandOptionType.STRING,
                            required: true,
                        },
                        {
                            name: "status",
                            description: "Enable or disable option",
                            type: slash_create_1.CommandOptionType.BOOLEAN,
                            required: true,
                        },
                    ],
                },
                {
                    name: "image",
                    description: "Update image for map config",
                    type: slash_create_1.CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: "name",
                            description: "Config name",
                            type: slash_create_1.CommandOptionType.STRING,
                            required: true,
                        },
                        {
                            name: "link",
                            description: "Past link to image or leave blank for deleting image",
                            type: slash_create_1.CommandOptionType.STRING,
                            required: false,
                        },
                    ],
                },
            ],
        },
        {
            name: "show",
            description: "Show map config list or search specific one",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "name",
                    description: "Enter name to search map config",
                    type: slash_create_1.CommandOptionType.STRING,
                    required: false,
                },
            ],
        },
        {
            name: "delete",
            description: "Delete map config",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "name",
                    description: "Config name to delte",
                    type: slash_create_1.CommandOptionType.STRING,
                    required: true,
                },
            ],
        },
    ],
};
