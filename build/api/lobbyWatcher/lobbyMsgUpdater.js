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
exports.lobbyMsgUpdater = void 0;
const discord_js_1 = require("discord.js");
const md5_1 = __importDefault(require("md5"));
const startGame_1 = require("../../components/buttons/startGame");
const unhostGame_1 = require("../../components/buttons/unhostGame");
const lobby_1 = require("../../embeds/lobby");
const kies_1 = require("../../redis/kies");
const redis_1 = require("../../redis/redis");
const discordMessage_1 = require("../../utils/discordMessage");
const globals_1 = require("../../utils/globals");
const lobbyParser_1 = require("../../utils/lobbyParser");
const log_1 = require("../../utils/log");
const mapConfig_1 = require("../../utils/mapConfig");
const lobbyMsgUpdater = (guildID, botid, delay) => __awaiter(void 0, void 0, void 0, function* () {
    const settingsKey = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
    const settings = (yield redis_1.redis.get(settingsKey));
    if (settings === undefined) {
        (0, log_1.log)("[lobby msg updater] redis error");
        setTimeout(() => (0, exports.lobbyMsgUpdater)(guildID, botid, delay), delay);
        return;
    }
    if (settings === null) {
        (0, log_1.log)("[lobby msg updater] deleted");
        return;
    }
    if (settings.paused) {
        (0, log_1.log)("[lobby msg updater] stopped");
        setTimeout(() => (0, exports.lobbyMsgUpdater)(guildID, botid, delay), delay);
        return;
    }
    const lobbySettingsKey = kies_1.redisKey.struct(kies_1.groupsKey.lobbyGameWatcher, [
        guildID,
        settings.channelID,
        botid.toString(),
    ]);
    const lobbySettings = (yield redis_1.redis.get(lobbySettingsKey));
    if (lobbySettings === undefined) {
        (0, log_1.log)("[lobby msg updater] redis error");
        setTimeout(() => (0, exports.lobbyMsgUpdater)(guildID, botid, delay), delay);
        return;
    }
    if (lobbySettings === null) {
        (0, log_1.log)("[lobby msg updater] deleted");
        return;
    }
    const msg = yield (0, discordMessage_1.getMessageById)(lobbySettings.msgId, settings.channelID);
    const game = yield (0, lobbyParser_1.getCurrentLobby)(guildID, botid);
    if (game === undefined) {
        (0, log_1.log)("[lobby msg updater] error getting game");
        setTimeout(() => (0, exports.lobbyMsgUpdater)(guildID, botid, delay), delay);
        return;
    }
    if (game === null) {
        (0, log_1.log)("[lobby msg updater] game does not exist, deleting msg");
        const result = yield redis_1.redis.del(lobbySettingsKey);
        if (result === undefined) {
            (0, log_1.log)("[lobby msg updater] cant delete redis data");
            setTimeout(() => (0, exports.lobbyMsgUpdater)(guildID, botid, delay), delay);
            return;
        }
        (0, discordMessage_1.deleteMessageWithDelay)(msg, 0);
        return;
    }
    const { parsedGame, newLobbyHash, prevLobbyHash } = yield getGameParams(guildID, game, lobbySettings);
    const msgEmbeds = [(0, lobby_1.lobbyGame)(parsedGame)];
    if (!msg) {
        (0, log_1.log)("[lobby msg updater] cant get prev msg, creating new one");
        const msgComponents = [
            new discord_js_1.MessageActionRow().addComponents((0, startGame_1.startGameButtonDefault)({ disabled: game.slotsTaken === 0 }), (0, unhostGame_1.unhostGameButtonDefault)()),
        ];
        const newMsg = yield (0, discordMessage_1.sendResponse)(settings.channelID, {
            embeds: msgEmbeds,
            components: msgComponents,
        });
        yield redis_1.redis.set(lobbySettingsKey, Object.assign(Object.assign({}, lobbySettings), { msgId: newMsg.id, lobbyHash: newLobbyHash }));
        setTimeout(() => (0, exports.lobbyMsgUpdater)(guildID, botid, delay), delay);
        return;
    }
    const infoChanged = prevLobbyHash !== newLobbyHash;
    if (!infoChanged) {
        setTimeout(() => (0, exports.lobbyMsgUpdater)(guildID, botid, delay), delay);
        return;
    }
    (0, log_1.log)("[lobby msg updater] updating msg");
    yield redis_1.redis.set(lobbySettingsKey, Object.assign(Object.assign({}, lobbySettings), { lobbyHash: newLobbyHash }));
    const startButton = msg.resolveComponent(globals_1.buttonId.startGame) ||
        (0, startGame_1.startGameButtonDefault)();
    const unhostButton = msg.resolveComponent(globals_1.buttonId.unhostGame) ||
        (0, unhostGame_1.unhostGameButtonDefault)();
    yield (0, discordMessage_1.editMessage)(msg, {
        embeds: msgEmbeds,
        components: [
            new discord_js_1.MessageActionRow().addComponents(startButton.setDisabled(game.slotsTaken === 0), unhostButton),
        ],
    });
    setTimeout(() => (0, exports.lobbyMsgUpdater)(guildID, botid, delay), delay);
    return;
});
exports.lobbyMsgUpdater = lobbyMsgUpdater;
const getGameParams = (guildID, game, lobbySettings) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield (0, mapConfig_1.searchMapConfigByMapName)(game.mapname, guildID);
    const optionField = config && config.options.ranking
        ? "winrate" /* winrate */
        : "server" /* server */;
    const parsedPlayers = (0, lobbyParser_1.playersLobbyToString)(game.players, optionField);
    const parsedGame = Object.assign(Object.assign({}, game), { players: parsedPlayers });
    const prevLobbyHash = lobbySettings.lobbyHash;
    const newLobbyHash = (0, md5_1.default)(parsedPlayers.nicks + JSON.stringify(parsedPlayers.option) + game.mapname);
    return { prevLobbyHash, newLobbyHash, parsedGame };
});
