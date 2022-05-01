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
const start_1 = require("../api/commands/gamestats/start");
const stop_1 = require("../api/commands/gamestats/stop");
const gamestats_1 = __importDefault(require("../commandData/gamestats"));
const response_1 = require("../embeds/response");
const globals_1 = require("../utils/globals");
module.exports = {
    data: gamestats_1.default,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && interaction.member.user.id !== globals_1.ownerID)
                return;
            if (!interaction.memberPermissions.has("ADMINISTRATOR"))
                return interaction.reply({
                    embeds: [(0, response_1.warning)("This command only for admins")],
                    ephemeral: true,
                });
            yield interaction.deferReply();
            switch (interaction.options.getSubcommand()) {
                case "start":
                    yield (0, start_1.start)(interaction);
                    return;
                case "stop":
                    yield (0, stop_1.stop)(interaction);
                    return;
                default:
                    return yield interaction.editReply("...");
            }
        });
    },
};
