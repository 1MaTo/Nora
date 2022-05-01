"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showConfigSelectorButtonError = exports.showConfigSelectorButtonSuccess = exports.showConfigSelectorButtonLoading = exports.showConfigSelectorButtonDefault = void 0;
const discord_js_1 = require("discord.js");
const globals_1 = require("../../utils/globals");
const showConfigSelectorButtonDefault = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.showConfigSelector)
        .setLabel(label || "Show config loader")
        .setStyle(style || "PRIMARY")
        .setDisabled(disabled || false);
};
exports.showConfigSelectorButtonDefault = showConfigSelectorButtonDefault;
const showConfigSelectorButtonLoading = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.showConfigSelector)
        .setLabel(label || "Loading...")
        .setStyle(style || "SECONDARY")
        .setDisabled(disabled || true);
};
exports.showConfigSelectorButtonLoading = showConfigSelectorButtonLoading;
const showConfigSelectorButtonSuccess = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.showConfigSelector)
        .setLabel(label || "Config loaded")
        .setStyle(style || "SUCCESS")
        .setDisabled(disabled || true);
};
exports.showConfigSelectorButtonSuccess = showConfigSelectorButtonSuccess;
const showConfigSelectorButtonError = ({ label, style, disabled, } = {}) => {
    return new discord_js_1.MessageButton()
        .setCustomId(globals_1.buttonId.showConfigSelector)
        .setLabel(label || "Network error")
        .setStyle(style || "DANGER")
        .setDisabled(disabled || true);
};
exports.showConfigSelectorButtonError = showConfigSelectorButtonError;
