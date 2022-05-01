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
exports.client = void 0;
const discord_js_1 = require("discord.js");
const reload_1 = require("./api/reload/reload");
const auth_json_1 = require("./auth.json");
const botStatus_1 = require("./utils/botStatus");
const clearRedisOnStart_1 = require("./utils/clearRedisOnStart");
const globals_1 = require("./utils/globals");
const listenButtons_1 = require("./utils/listenButtons");
const listenCommands_1 = require("./utils/listenCommands");
const listenSelectMenus_1 = require("./utils/listenSelectMenus");
const loadCommands_1 = require("./utils/loadCommands");
const log_1 = require("./utils/log");
const restartTimers_1 = require("./utils/restartTimers");
const sleep_1 = require("./utils/sleep");
const timerFuncs_1 = require("./utils/timerFuncs");
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
    ],
});
(0, loadCommands_1.loadCommands)();
exports.client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    (0, log_1.log)("------> SETTING UP");
    yield (0, clearRedisOnStart_1.clearRedisOnStart)();
    const lwCount = yield (0, restartTimers_1.restartLobbyWatcher)();
    if (globals_1.production) {
        // Restart lobby watchers
        yield (0, botStatus_1.changeBotStatus)("☀ Just woke up");
        yield (0, sleep_1.sleep)(2000);
        const gsCount = yield (0, restartTimers_1.restartGamestats)();
        // Check for ghost status (available or no)
        setTimeout(() => (0, timerFuncs_1.ghostStatusUpdater)(), 5000);
        setTimeout(() => (0, timerFuncs_1.lobbyStatusUpdater)(), 10000);
        setTimeout(() => (0, timerFuncs_1.gamesStatusUpdater)(1000 * 10), 15000);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, botStatus_1.changeBotStatus)("🔄 Planned reboot 🔄");
            yield (0, reload_1.reloadBot)(false);
        }), 1000 * 60 * 60 * 24);
        yield (0, botStatus_1.updateStatusInfo)();
    }
    (0, log_1.log)("------> BOT IN DEVELOPMENT OR LOGS ENABLED");
}));
(0, listenCommands_1.listenCommands)();
(0, listenButtons_1.listenButtons)();
(0, listenSelectMenus_1.listenSelectMenus)();
process.on("unhandledRejection", (error) => {
    (0, log_1.log)("[bot]", error);
});
exports.client.login(auth_json_1.token);
