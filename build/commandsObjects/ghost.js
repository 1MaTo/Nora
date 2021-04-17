"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ghostCommand = void 0;
const globals_1 = require("../utils/globals");
exports.ghostCommand = {
    name: "ghost",
    description: "Send command to ghost",
    guildID: globals_1.guildIDs.ghostGuild,
    options: [
        {
            name: "pub",
            description: "host game",
            type: 1,
            options: [
                {
                    name: "gamename",
                    type: 3,
                    description: "Game name",
                    required: false,
                },
            ],
        },
        {
            name: "unhost",
            description: "Unhost game in lobby",
            type: 1,
        },
        {
            name: "start",
            description: "Start game in lobby",
            type: 1,
            options: [
                {
                    name: "force",
                    type: 5,
                    description: "Skip checks or not",
                    required: false,
                },
            ],
        },
        {
            name: "load",
            description: "Load map config from exist file",
            type: 1,
            options: [
                {
                    name: "map",
                    type: 3,
                    description: "load map",
                    required: true,
                },
            ],
        },
    ],
};
