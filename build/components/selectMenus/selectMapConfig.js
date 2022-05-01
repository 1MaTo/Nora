"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectMapConfig = void 0;
const discord_js_1 = require("discord.js");
const globals_1 = require("../../utils/globals");
const selectMapConfig = (options, defaultOption) => {
    return new discord_js_1.MessageSelectMenu()
        .setCustomId(globals_1.selectMenuId.selectMapConfig)
        .setPlaceholder("Select map config")
        .addOptions(options.map((option) => {
        return {
            label: option,
            value: option,
            default: option === defaultOption,
        };
    }));
};
exports.selectMapConfig = selectMapConfig;
