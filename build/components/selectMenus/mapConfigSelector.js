"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapConfigSelectorError = exports.mapConfigSelectorSuccess = exports.mapConfigSelectorLoading = exports.mapConfigSelectorDefault = void 0;
const discord_js_1 = require("discord.js");
const globals_1 = require("../../utils/globals");
const mapConfigSelectorDefault = ({ options, defaultOption, placeholder, disabled, }) => {
    return new discord_js_1.MessageSelectMenu()
        .setCustomId(globals_1.selectMenuId.selectMapConfigWatcherHub)
        .setPlaceholder(placeholder || "Select map config")
        .setDisabled(disabled || false)
        .addOptions(options.map((option) => {
        return {
            label: option,
            value: option,
            default: option === defaultOption,
        };
    }));
};
exports.mapConfigSelectorDefault = mapConfigSelectorDefault;
const mapConfigSelectorLoading = ({ options, defaultOption, placeholder, disabled, }) => {
    return new discord_js_1.MessageSelectMenu()
        .setCustomId(globals_1.selectMenuId.selectMapConfigWatcherHub)
        .setPlaceholder(placeholder || "Loading map...")
        .setDisabled(disabled || true)
        .addOptions(options.map((option) => {
        return {
            label: option,
            value: option,
            default: option === defaultOption,
        };
    }));
};
exports.mapConfigSelectorLoading = mapConfigSelectorLoading;
const mapConfigSelectorSuccess = ({ options, defaultOption, placeholder, disabled, }) => {
    return new discord_js_1.MessageSelectMenu()
        .setCustomId(globals_1.selectMenuId.selectMapConfigWatcherHub)
        .setPlaceholder(placeholder || "Map loaded")
        .setDisabled(disabled || true)
        .addOptions(options.map((option) => {
        return {
            label: option,
            value: option,
            default: option === defaultOption,
        };
    }));
};
exports.mapConfigSelectorSuccess = mapConfigSelectorSuccess;
const mapConfigSelectorError = ({ options, defaultOption, placeholder, disabled, }) => {
    return new discord_js_1.MessageSelectMenu()
        .setCustomId(globals_1.selectMenuId.selectMapConfigWatcherHub)
        .setPlaceholder(placeholder || "Network error")
        .setDisabled(disabled || true)
        .addOptions(options.map((option) => {
        return {
            label: option,
            value: option,
            default: option === defaultOption,
        };
    }));
};
exports.mapConfigSelectorError = mapConfigSelectorError;
