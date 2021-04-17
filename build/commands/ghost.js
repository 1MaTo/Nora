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
const slash_create_1 = require("slash-create");
const ghost_1 = require("../commandsObjects/ghost");
const response_1 = require("../embeds/response");
const discordMessage_1 = require("../utils/discordMessage");
const events_1 = require("../utils/events");
const globals_1 = require("../utils/globals");
const lobbyParser_1 = require("../utils/lobbyParser");
const log_1 = require("../utils/log");
const notifications_1 = require("../utils/notifications");
const requestToGuiServer_1 = require("../utils/requestToGuiServer");
class ghost extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, ghost_1.ghostCommand);
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && ctx.member.id !== globals_1.ownerID)
                return;
            if (ctx.options.pub) {
                const message = yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.loading() });
                const result = yield pubGame(ctx.options.pub["gamename"]);
                if (result) {
                    message.edit({ embed: response_1.success(`Game ${result} hosted`) });
                }
                else if (result === false) {
                    message.edit({
                        embed: response_1.warning(`Another lobby already exists | No map loaded`),
                    });
                }
                else {
                    message.edit({ embed: response_1.error(`Network error`) });
                }
                message.delete({ timeout: globals_1.ghostCmd.deleteMessageTimeout });
                return;
            }
            if (ctx.options.unhost) {
                const message = yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.loading() });
                const result = yield unhostGame();
                if (result) {
                    message.edit({ embed: response_1.success(`Game ${result} unhosted`) });
                }
                else if (result === false) {
                    message.edit({
                        embed: response_1.warning(`Nothing to unhost`),
                    });
                }
                else {
                    message.edit({ embed: response_1.error(`Network error`) });
                }
                message.delete({ timeout: globals_1.ghostCmd.deleteMessageTimeout });
                return;
            }
            if (ctx.options.start) {
                const message = yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.loading("Starting game..."),
                });
                const result = yield startGame(ctx.options.start["force"]);
                const games = yield lobbyParser_1.getCurrentLobbies(ctx.guildID);
                if (result) {
                    globals_1.botStatusVariables.gameCount += 1;
                    events_1.botStatusInfo.emit("update" /* update */);
                    const game = games.find((game) => game.gamename == result.replace(/[\[\]]/g, ""));
                    log_1.log(game, result);
                    if (game) {
                        notifications_1.pingUsersOnStart(game, ctx.guildID);
                    }
                    message.edit({ embed: response_1.success(`Game ${result} started`) });
                }
                else if (result === false) {
                    message.edit({
                        embed: response_1.warning(`Nothing to start | Users are not pinged`),
                    });
                }
                else {
                    message.edit({ embed: response_1.error(`Network error`) });
                }
                message.delete({ timeout: globals_1.ghostCmd.deleteMessageTimeout });
                return;
            }
            if (ctx.options.load) {
                const message = yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.loading("Load map config..."),
                });
                const result = yield loadMapCfg(ctx.options.load["map"]);
                if (result) {
                    message.edit({ embed: response_1.success(`Map ${result} loaded`) });
                }
                else if (result === false) {
                    message.edit({
                        embed: response_1.warning(`No maps found for this pattern`),
                    });
                }
                else {
                    message.edit({ embed: response_1.error(`Network error`) });
                }
                message.delete({ timeout: globals_1.ghostCmd.deleteMessageTimeout });
                return;
            }
            if (ctx.options.map) {
                const message = yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.loading("Load map config..."),
                });
                const result = yield loadMap(ctx.options.map["name"]);
                if (result) {
                    message.edit({ embed: response_1.success(`Map ${result} loaded`) });
                }
                else if (result === false) {
                    message.edit({
                        embed: response_1.warning(`No maps found for this pattern`),
                    });
                }
                else {
                    message.edit({ embed: response_1.error(`Network error`) });
                }
                message.delete({ timeout: globals_1.ghostCmd.deleteMessageTimeout });
                return;
            }
        });
    }
}
exports.default = ghost;
const pubGame = (gamename) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield requestToGuiServer_1.getChatRows();
    const commandSent = yield requestToGuiServer_1.sendCommand(`pub ${gamename ? gamename : ""}`);
    if (!commandSent)
        return null;
    const result = yield requestToGuiServer_1.checkLogsForKeyWords(/creating game \[.*\]/, rows, globals_1.ghostCmd.requestInterval, globals_1.ghostCmd.pendingTimeout);
    if (result) {
        return result.match(/ \[.*\]/)[0];
    }
    return result;
});
const unhostGame = () => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield requestToGuiServer_1.getChatRows();
    const commandSent = yield requestToGuiServer_1.sendCommand("unhost");
    if (!commandSent)
        return null;
    const result = yield requestToGuiServer_1.checkLogsForKeyWords(/deleting current game \[.*\]/, rows, globals_1.ghostCmd.requestInterval, globals_1.ghostCmd.pendingTimeout);
    if (result) {
        return result.match(/ \[.*\]/)[0];
    }
    return result;
});
const startGame = (force) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield requestToGuiServer_1.getChatRows();
    const commandSent = yield requestToGuiServer_1.sendCommand(`start ${force ? "force" : ""}`);
    if (!commandSent)
        return null;
    const result = yield requestToGuiServer_1.checkLogsForKeyWords(/GAME:.*started loading with \d+ players/, rows, 1000, globals_1.ghostCmd.pendingTimeout + 4);
    if (result) {
        return result.match(/GAME: .*\]/)[0].replace("GAME: ", "[");
    }
    return result;
});
const loadMapCfg = (map) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield requestToGuiServer_1.getChatRows();
    const commandSend = requestToGuiServer_1.sendCommand(`load ${map ? map : ""}`);
    if (!commandSend)
        return null;
    const result = yield requestToGuiServer_1.checkLogsForKeyWords(/CONFIG] loading file/, rows, 500, 3000);
    if (result) {
        return result.match(/[^/]+$/)[0].slice(0, -5);
    }
    return result;
});
const loadMap = (map) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield requestToGuiServer_1.getChatRows();
    const commandSend = requestToGuiServer_1.sendCommand(`map ${map ? map : ""}`);
    if (!commandSend)
        return null;
    const result = yield requestToGuiServer_1.checkLogsForKeyWords(/MAP] loading MPQ file/, rows, 500, 3000);
    if (result) {
        return result.match(/[^\\]+$/)[0].slice(0, -5);
    }
    return result;
});
