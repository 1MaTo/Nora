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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const damage_1 = require("../api/commands/stats/damage");
const totalgames_1 = require("../api/commands/stats/totalgames");
const winrate_1 = require("../api/commands/stats/winrate");
const stats_1 = __importDefault(require("../commandData/stats"));
const globals_1 = require("../utils/globals");
module.exports = {
    data: stats_1.default,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && interaction.member.user.id !== globals_1.ownerID)
                return;
            yield interaction.deferReply();
            switch (interaction.options.getSubcommand()) {
                case "totalgames":
                    yield (0, totalgames_1.totalgames)(interaction);
                    return;
                case "winrate":
                    yield (0, winrate_1.winrate)(interaction);
                    return;
                case "damage":
                    yield (0, damage_1.damage)(interaction);
                    return;
                default:
                    return yield interaction.editReply("...");
            }
        });
    },
};
