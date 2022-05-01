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
exports.headerMsgUpdater = void 0;
const queries_1 = require("../../db/queries");
const lobby_1 = require("../../embeds/lobby");
const kies_1 = require("../../redis/kies");
const redis_1 = require("../../redis/redis");
const discordMessage_1 = require("../../utils/discordMessage");
const globals_1 = require("../../utils/globals");
const log_1 = require("../../utils/log");
const runNewLobbies_1 = require("../../utils/runNewLobbies");
const getCurrentCommandHub_1 = require("./getCurrentCommandHub");
const headerMsgUpdater = (guildID, delay) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [guildID]);
    const settings = (yield redis_1.redis.get(key));
    if (settings === undefined) {
        (0, log_1.log)("[header msg updater] redis error");
        goToNextUpdate(guildID, delay);
        return;
    }
    if (settings === null) {
        (0, log_1.log)("[header msg updater] deleted");
        return;
    }
    if (settings.paused) {
        (0, log_1.log)("[header msg updater] stopped");
        goToNextUpdate(guildID, delay);
        return;
    }
    const lobbyList = yield (0, queries_1.getLobbyList)(settings.botid);
    if (!lobbyList) {
        (0, log_1.log)("[header msg updater] cant get lobby list");
        goToNextUpdate(guildID, delay);
        return;
    }
    yield (0, runNewLobbies_1.runNewLobbies)(settings, lobbyList);
    const msg = yield (0, discordMessage_1.getMessageById)(settings.headerID, settings.channelID);
    const msgEmbeds = [(0, lobby_1.header)(lobbyList.length, settings.lastLoadedMap)];
    const msgComponents = (0, getCurrentCommandHub_1.getCommandHubState)(lobbyList.length !== 0);
    if (!msg) {
        (0, log_1.log)("[header msg updater] cant get prev msg, creating new one");
        const newMsg = yield (0, discordMessage_1.sendResponse)(settings.channelID, {
            embeds: msgEmbeds,
            components: msgComponents,
        });
        yield redis_1.redis.set(key, Object.assign(Object.assign({}, settings), { headerID: newMsg ? newMsg.id : null, forceUpdate: false }));
        goToNextUpdate(guildID, delay);
        return;
    }
    const selectConfigMenu = msg.resolveComponent(globals_1.selectMenuId.selectMapConfigWatcherHub);
    const infoChanged = lobbyList.length !== settings.activeLobbyCount ||
        settings.forceUpdate ||
        selectConfigMenu;
    if (!infoChanged) {
        goToNextUpdate(guildID, delay);
        return;
    }
    (0, log_1.log)("[header msg updater] updating msg");
    yield redis_1.redis.set(key, Object.assign(Object.assign({}, settings), { activeLobbyCount: lobbyList.length, forceUpdate: false }));
    yield (0, discordMessage_1.editMessage)(msg, {
        embeds: msgEmbeds,
        components: msgComponents,
    });
    goToNextUpdate(guildID, delay);
    return;
});
exports.headerMsgUpdater = headerMsgUpdater;
const goToNextUpdate = (guildID, delay) => {
    setTimeout(() => (0, exports.headerMsgUpdater)(guildID, delay), delay);
};
