"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamestatsCommand = void 0;
const slash_create_1 = require("slash-create");
const globals_1 = require("../utils/globals");
exports.gamestatsCommand = {
    name: "gamestats",
    description: "Stats collecting after game",
    guildID: globals_1.guildIDs.ghostGuild,
    requiredPermissions: ["ADMINISTRATOR"],
    options: [
        {
            name: "start",
            description: "Start collecting stats",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "channel",
                    description: "Channel to send messages",
                    type: slash_create_1.CommandOptionType.CHANNEL,
                },
            ],
        },
        {
            name: "stop",
            description: "Stop collecting stats",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
        },
    ],
};
