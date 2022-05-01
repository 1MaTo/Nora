"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshWatcherButtonDefault = void 0;
const discord_js_1 = require("discord.js");
const globals_1 = require("../../utils/globals");
const refreshWatcherButtonDefault = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.refreshWatcher)
        .setLabel(label || "")
        .setStyle(style || "SECONDARY")
        .setEmoji("🔄")
        .setDisabled(disabled || false);
};
exports.refreshWatcherButtonDefault = refreshWatcherButtonDefault;
