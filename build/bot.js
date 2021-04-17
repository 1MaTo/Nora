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
exports.creator = exports.client = void 0;
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const slash_create_1 = require("slash-create");
const auth_json_1 = require("./auth.json");
const botStatus_1 = require("./utils/botStatus");
const globals_1 = require("./utils/globals");
const log_1 = require("./utils/log");
const reloadBot_1 = require("./utils/reloadBot");
const restartTimers_1 = require("./utils/restartTimers");
const sleep_1 = require("./utils/sleep");
const timerFuncs_1 = require("./utils/timerFuncs");
exports.client = new discord_js_1.Client();
exports.creator = new slash_create_1.SlashCreator({
    applicationID: auth_json_1.appId,
    publicKey: auth_json_1.publicKey,
    token: auth_json_1.token,
});
exports.client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    log_1.log("------> SETTING UP");
    if (globals_1.production) {
        // Restart lobby watchers
        yield botStatus_1.changeBotStatus("☀ Just woke up");
        sleep_1.sleep(2000);
        const lwCount = yield restartTimers_1.restartLobbyWatcher();
        const gsCount = yield restartTimers_1.restartGamestats();
        // Check for ghost status (available or no)
        setTimeout(() => timerFuncs_1.ghostStatusUpdater(), 5000);
        setTimeout(() => timerFuncs_1.lobbyStatusUpdater(), 10000);
        setTimeout(() => timerFuncs_1.gamesStatusUpdater(1000 * 60 * 5), 15000);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield botStatus_1.changeBotStatus("🔄 Planned reboot 🔄");
            yield reloadBot_1.reloadBot(false);
        }), 1000 * 60 * 60 * 24);
        yield botStatus_1.updateStatusInfo();
    }
    log_1.log("------> BOT IN DEVELOPMENT");
}));
//creator.on("debug", (message) => log("[DEBUG] ----> ", message));
exports.creator.on("warn", (message) => log_1.log("[WARNING] ----> ", message));
exports.creator.on("error", (error) => log_1.log("[ERROR] ----> ", error));
exports.creator.on("synced", () => log_1.log("[COMMAND SYNCED]"));
exports.creator.on("commandRegister", (command) => log_1.log(`[REGISTERED COMMAND] ----> ${command.commandName}`));
exports.creator.on("commandError", (command, error) => log_1.log(`[COMMAND ERROR] [${command.commandName}] ----> `, error));
exports.creator
    .withServer(new slash_create_1.GatewayServer((handler) => exports.client.ws.on("INTERACTION_CREATE", handler)))
    .registerCommandsIn(path_1.default.join(__dirname, "commands"))
    .syncCommands();
exports.client.login(auth_json_1.token);
