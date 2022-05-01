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
exports.deleteCofnig = void 0;
const response_1 = require("../../../embeds/response");
const globals_1 = require("../../../utils/globals");
const mapConfig_1 = require("../../../utils/mapConfig");
const deleteCofnig = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const cfgName = interaction.options.getString("name");
    const deleted = yield (0, mapConfig_1.deleteMapConfig)(interaction.guildId, cfgName);
    if (deleted) {
        yield interaction.editReply({
            embeds: [(0, response_1.success)(`${cfgName} deleted`)],
        });
        setTimeout(() => interaction.deleteReply(), globals_1.ghostCmd.deleteMessageTimeout);
        return;
    }
    yield interaction.editReply({
        embeds: [(0, response_1.warning)(`Can't find ${cfgName}`)],
    });
    setTimeout(() => interaction.deleteReply(), globals_1.ghostCmd.deleteMessageTimeout);
});
exports.deleteCofnig = deleteCofnig;
