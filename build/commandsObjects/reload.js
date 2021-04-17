"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadCommand = void 0;
const slash_create_1 = require("slash-create");
exports.reloadCommand = {
    name: "reload",
    description: "reload bot (OWNER COMMAND)",
    options: [
        {
            name: "update",
            description: "update before restart?",
            type: slash_create_1.CommandOptionType.BOOLEAN,
            required: true,
        },
    ],
};
