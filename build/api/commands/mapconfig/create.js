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
exports.create = void 0;
const response_1 = require("../../../embeds/response");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const mapConfig_1 = require("../../../utils/mapConfig");
const create = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const slotMap = parseToSlotMap(interaction.options.getString("teams"));
    const maxSlotsInSlotMap = slotMap && slotMap.reduce((summ, curr) => (summ += curr.slots), 0);
    if (!slotMap ||
        maxSlotsInSlotMap !== interaction.options.getInteger("slots")) {
        yield (0, discordMessage_1.editReply)(interaction, { embeds: [(0, response_1.error)("Bad team values")] }, globals_1.ghostCmd.deleteMessageTimeout);
        return;
    }
    const isNew = yield (0, mapConfig_1.createOrUpdateMapConfig)(interaction.guildId, {
        guildID: interaction.guildId,
        name: interaction.options.getString("name"),
        slotMap,
        slots: maxSlotsInSlotMap,
    });
    if (isNew) {
        yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.success)("New config created")],
        }, globals_1.ghostCmd.deleteMessageTimeout);
        return;
    }
    yield (0, discordMessage_1.editReply)(interaction, {
        embeds: [(0, response_1.success)("Config was updated")],
    }, globals_1.ghostCmd.deleteMessageTimeout);
    return;
});
exports.create = create;
const parseToSlotMap = (raw) => {
    try {
        const slotMap = raw.split("|").reduce((teams, raw) => {
            const team = raw.split(",");
            if (isNaN(+team[1]) || +team[1] <= 0)
                throw new Error("Bad team slots value");
            return [
                ...teams,
                {
                    name: team[0].trim(),
                    slots: +team[1],
                },
            ];
        }, []);
        return slotMap;
    }
    catch (error) {
        return null;
    }
};
