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
exports.botEvents = void 0;
const events_1 = __importDefault(require("events"));
const resetCommandHubState_1 = require("../api/lobbyWatcher/resetCommandHubState");
const botStatus_1 = require("./botStatus");
exports.botEvents = new events_1.default();
exports.botEvents.on("update" /* update */, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, botStatus_1.updateStatusInfo)();
}));
exports.botEvents.on("lobby-watcher-config-loaded" /* lobbyWatcherConfigLoaded */, (message, delay, config) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, resetCommandHubState_1.resetCommandHubState)(message, delay, config);
}));
