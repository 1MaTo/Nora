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
exports.listenCommands = void 0;
const bot_1 = require("../bot");
const response_1 = require("../embeds/response");
const discordMessage_1 = require("./discordMessage");
const globals_1 = require("./globals");
const log_1 = require("./log");
const logCmd_1 = require("./logCmd");
const listenCommands = () => bot_1.client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (globals_1.production && interaction.guildId !== globals_1.guildIDs.ghostGuild)
        return;
    if (!globals_1.production && interaction.guildId !== globals_1.guildIDs.debugGuild)
        return;
    if (!interaction.isCommand())
        return;
    const command = bot_1.client.commands.get(interaction.commandName);
    if (!command)
        return;
    if (command.ownerOnly && interaction.user.id !== globals_1.ownerID) {
        (0, discordMessage_1.sendReply)(interaction, {
            embeds: [(0, response_1.warning)("This command is only for owner")],
        }, globals_1.msgDeleteTimeout.short);
        return;
    }
    (0, logCmd_1.logCommand)(interaction);
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        (0, log_1.log)(error);
        try {
            yield interaction.reply({
                content: ">_< Bakaaa!!! ",
                ephemeral: true,
            });
        }
        catch (err) {
            (0, log_1.log)(error);
        }
    }
}));
exports.listenCommands = listenCommands;
