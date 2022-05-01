"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const loadMapFromFile_1 = require("../../api/ghost/loadMapFromFile");
const response_1 = require("../../embeds/response");
const discordMessage_1 = require("../../utils/discordMessage");
const globals_1 = require("../../utils/globals");
module.exports = {
    id: globals_1.selectMenuId.selectMapConfig,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = interaction.message;
            const selectMenu = message.resolveComponent(globals_1.selectMenuId.selectMapConfig);
            const rowIndex = message.components.findIndex((comp) => comp.components.findIndex((comp) => comp.customId === globals_1.selectMenuId.selectMapConfig) !== -1);
            const compIndex = message.components[rowIndex].components.findIndex((comp) => comp.customId === globals_1.selectMenuId.selectMapConfig);
            if (!selectMenu)
                return;
            message.components[rowIndex].components[compIndex] = selectMenu
                .setDisabled(true)
                .setPlaceholder(`Loading ${interaction.values[0]}...`);
            yield interaction.update({ components: message.components });
            const result = yield (0, loadMapFromFile_1.loadMapFromFile)(interaction.values[0]);
            switch (result) {
                case "success":
                case "timeout":
                    yield message.edit({
                        embeds: [(0, response_1.success)(`${interaction.values[0]} loaded`)],
                        components: [],
                    });
                    (0, discordMessage_1.deleteMessageWithDelay)(message, globals_1.msgDeleteTimeout.default);
                    return;
                case "uknown":
                case "error":
                    yield message.edit({
                        embeds: [(0, response_1.warning)(`Can not load this config`)],
                        components: [],
                    });
                    (0, discordMessage_1.deleteMessageWithDelay)(message, globals_1.msgDeleteTimeout.default);
                    return;
                case null:
                    yield message.edit({
                        embeds: [(0, response_1.error)(`Network error`)],
                        components: [],
                    });
                    (0, discordMessage_1.deleteMessageWithDelay)(message, globals_1.msgDeleteTimeout.default);
            }
        });
    },
};
