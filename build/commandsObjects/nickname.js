"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nicknameCommand = void 0;
const slash_create_1 = require("slash-create");
const globals_1 = require("../utils/globals");
exports.nicknameCommand = {
    name: "nick",
    description: "Nickname commands",
    guildID: globals_1.guildIDs.ghostGuild,
    options: [
        {
            name: "bind",
            description: "Bind nickname to your discord account",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "nickname",
                    description: "Nick to bind",
                    type: slash_create_1.CommandOptionType.STRING,
                    required: true,
                },
            ],
        },
        {
            name: "unbind",
            description: "Unbind nickname from your discord account",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
        },
        {
            name: "show",
            description: "Show binded nickname",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
        },
        {
            name: "rebind",
            description: "[ADMIN] Rebind nickname from one user to another",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "nickname",
                    description: "nick to rebind",
                    type: slash_create_1.CommandOptionType.STRING,
                    required: true,
                },
                {
                    name: "user",
                    description: "user to bind nickname to",
                    type: slash_create_1.CommandOptionType.USER,
                    required: true,
                },
            ],
        },
        {
            name: "ping_on_start",
            description: "If true - you will get pinged after game start",
            type: slash_create_1.CommandOptionType.SUB_COMMAND,
            options: [
                {
                    name: "value",
                    description: "If true - you will get pinged after game start",
                    type: slash_create_1.CommandOptionType.BOOLEAN,
                    required: true,
                },
            ],
        },
    ],
};
