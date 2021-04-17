"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lobbyCommand = void 0;
const slash_create_1 = require("slash-create");
const globals_1 = require("../utils/globals");
exports.lobbyCommand = {
    name: "lobby",
    description: "Checking for lobbies in real time (only one instance per server)",
    guildID: globals_1.guildIDs.ghostGuild,
    options: [
        {
            name: "start",
            description: "start lobby watcher",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "channel",
                    description: "channel to send messages",
                    required: false,
                    type: slash_create_1.CommandOptionType.CHANNEL,
                },
                {
                    name: "delay",
                    description: "Updatind interval",
                    type: slash_create_1.CommandOptionType.INTEGER,
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
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
        },
    ],
};
