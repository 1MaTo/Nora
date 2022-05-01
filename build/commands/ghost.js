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
const load_1 = require("../api/commands/ghost/load");
const pub_1 = require("../api/commands/ghost/pub");
const select_1 = require("../api/commands/ghost/select");
const start_1 = require("../api/commands/ghost/start");
const unhost_1 = require("../api/commands/ghost/unhost");
const ghost_1 = __importDefault(require("../commandData/ghost"));
const globals_1 = require("../utils/globals");
module.exports = {
    data: ghost_1.default,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && interaction.member.user.id !== globals_1.ownerID)
                return;
            switch (interaction.options.getSubcommand()) {
                case "pub":
                    yield interaction.deferReply();
                    yield (0, pub_1.pub)(interaction);
                    return;
                case "start":
                    yield interaction.deferReply();
                    yield (0, start_1.start)(interaction);
                    return;
                case "unhost":
                    yield interaction.deferReply();
                    yield (0, unhost_1.unhost)(interaction);
                    return;
                case "load-map":
                    yield interaction.deferReply();
                    yield (0, load_1.load)(interaction);
                    return;
                case "select-map":
                    yield interaction.deferReply();
                    yield (0, select_1.select)(interaction);
                    return;
                default:
                    return yield interaction.editReply("...");
            }
        });
    },
};
