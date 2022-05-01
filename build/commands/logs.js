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
const builders_1 = require("@discordjs/builders");
const getCommandLogs_1 = require("../api/logs/getCommandLogs");
const logs_1 = __importDefault(require("../commandData/logs"));
const response_1 = require("../embeds/response");
const discordMessage_1 = require("../utils/discordMessage");
const globals_1 = require("../utils/globals");
module.exports = {
    data: logs_1.default,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.memberPermissions.has("ADMINISTRATOR"))
                return interaction.reply({
                    embeds: [(0, response_1.warning)("This command only for admins")],
                    ephemeral: true,
                });
            yield interaction.deferReply();
            const logs = yield (0, getCommandLogs_1.getCommandLogs)(interaction.guildId, interaction.options.getString("query"));
            yield (0, discordMessage_1.editReply)(interaction, {
                embeds: [
                    new builders_1.Embed()
                        .setTitle(`Commands log${interaction.options.getString("query")
                        ? ` | ${interaction.options.getString("query")}`
                        : ""}`)
                        .setDescription(logs.length !== 0 ? logs.join("\n") : "no logs found..."),
                ],
            }, globals_1.msgDeleteTimeout.long);
        });
    },
};
