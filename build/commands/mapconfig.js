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
const create_1 = require("../api/commands/mapconfig/create");
const delete_1 = require("../api/commands/mapconfig/delete");
const show_1 = require("../api/commands/mapconfig/show");
const mapconfig_1 = __importDefault(require("../commandData/mapconfig"));
const globals_1 = require("../utils/globals");
module.exports = {
    data: mapconfig_1.default,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && interaction.member.user.id !== globals_1.ownerID)
                return;
            yield interaction.deferReply();
            switch (interaction.options.getSubcommand()) {
                case "create":
                    yield (0, create_1.create)(interaction);
                    return;
                case "show":
                    yield (0, show_1.show)(interaction);
                    return;
                case "delete":
                    yield (0, delete_1.deleteCofnig)(interaction);
                    return;
                default:
                    return yield interaction.editReply("...");
            }
        });
    },
};
