"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameButtonError = exports.startGameButtonSuccess = exports.startGameButtonLoading = exports.startGameButtonDefault = void 0;
const discord_js_1 = require("discord.js");
const globals_1 = require("../../utils/globals");
const startGameButtonDefault = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.startGame)
        .setLabel(label || "Start game")
        .setStyle(style || "PRIMARY")
        .setDisabled(disabled || false);
};
exports.startGameButtonDefault = startGameButtonDefault;
const startGameButtonLoading = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.startGame)
        .setLabel(label || "Loading...")
        .setStyle(style || "SECONDARY")
        .setDisabled(disabled || true);
};
exports.startGameButtonLoading = startGameButtonLoading;
const startGameButtonSuccess = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.startGame)
        .setLabel(label || "Game started")
        .setStyle(style || "SUCCESS")
        .setDisabled(disabled || true);
};
exports.startGameButtonSuccess = startGameButtonSuccess;
const startGameButtonError = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.startGame)
        .setLabel(label || "Network error")
        .setStyle(style || "DANGER")
        .setDisabled(disabled || true);
};
exports.startGameButtonError = startGameButtonError;
