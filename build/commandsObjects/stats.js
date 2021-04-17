"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsCommand = void 0;
const slash_create_1 = require("slash-create");
const globals_1 = require("../utils/globals");
exports.statsCommand = {
    name: "stats",
    description: "Statistic",
    guildID: globals_1.guildIDs.ghostGuild,
    options: [
        {
            name: "totalgames",
            description: "Show all games you played on bot with sorting by maps",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "nickname",
                    description: "Nickname to check, leave empty to check your binded nickname",
                    type: slash_create_1.CommandOptionType.STRING,
                    required: false,
                },
            ],
        },
        {
            name: "winrate",
            description: "Show your winrate statistic",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "nickname",
                    description: "Nickname to check, leave empty to check your binded nickname",
                    type: slash_create_1.CommandOptionType.STRING,
                    required: false,
                },
            ],
        },
        {
            name: "damage",
            description: "Leaderboard by damage",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
        },
    ],
};
