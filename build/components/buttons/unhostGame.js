"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unhostGameButtonError = exports.unhostGameButtonSuccess = exports.unhostGameButtonLoading = exports.unhostGameButtonDefault = void 0;
const discord_js_1 = require("discord.js");
const globals_1 = require("../../utils/globals");
const unhostGameButtonDefault = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.unhostGame)
        .setLabel(label || "Unhost game")
        .setStyle(style || "DANGER")
        .setDisabled(disabled || false);
};
exports.unhostGameButtonDefault = unhostGameButtonDefault;
const unhostGameButtonLoading = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.unhostGame)
        .setLabel(label || "Loading...")
        .setStyle(style || "SECONDARY")
        .setDisabled(disabled || true);
};
exports.unhostGameButtonLoading = unhostGameButtonLoading;
const unhostGameButtonSuccess = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.unhostGame)
        .setLabel(label || "Game unhosted")
        .setStyle(style || "SUCCESS")
        .setDisabled(disabled || true);
};
exports.unhostGameButtonSuccess = unhostGameButtonSuccess;
const unhostGameButtonError = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.unhostGame)
        .setLabel(label || "Network error")
        .setStyle(style || "DANGER")
        .setDisabled(disabled || true);
};
exports.unhostGameButtonError = unhostGameButtonError;
