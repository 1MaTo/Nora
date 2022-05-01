"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostGameButtonError = exports.hostGameButtonSuccess = exports.hostGameButtonLoading = exports.hostGameButtonDefault = void 0;
const discord_js_1 = require("discord.js");
const globals_1 = require("../../utils/globals");
const hostGameButtonDefault = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.hostGame)
        .setLabel(label || "Host game")
        .setStyle(style || "PRIMARY")
        .setDisabled(disabled || false);
};
exports.hostGameButtonDefault = hostGameButtonDefault;
const hostGameButtonLoading = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.hostGame)
        .setLabel(label || "Loading...")
        .setStyle(style || "SECONDARY")
        .setDisabled(disabled || true);
};
exports.hostGameButtonLoading = hostGameButtonLoading;
const hostGameButtonSuccess = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.hostGame)
        .setLabel(label || "Game hosted")
        .setStyle(style || "SUCCESS")
        .setDisabled(disabled || true);
};
exports.hostGameButtonSuccess = hostGameButtonSuccess;
const hostGameButtonError = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.hostGame)
        .setLabel(label || "Network error")
        .setStyle(style || "DANGER")
        .setDisabled(disabled || true);
};
exports.hostGameButtonError = hostGameButtonError;
