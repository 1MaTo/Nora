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
const discord_js_1 = require("discord.js");
const hostGame_1 = require("../../components/buttons/hostGame");
const refreshWatcher_1 = require("../../components/buttons/refreshWatcher");
const showConfigSelector_1 = require("../../components/buttons/showConfigSelector");
const kies_1 = require("../../redis/kies");
const redis_1 = require("../../redis/redis");
const globals_1 = require("../../utils/globals");
module.exports = {
    id: globals_1.buttonId.refreshWatcher,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.update({
                components: [
                    new discord_js_1.MessageActionRow().addComponents((0, hostGame_1.hostGameButtonDefault)({ disabled: true }), (0, showConfigSelector_1.showConfigSelectorButtonDefault)({ disabled: true }), (0, refreshWatcher_1.refreshWatcherButtonDefault)()),
                ],
            });
            const settingsKey = kies_1.redisKey.struct(kies_1.groupsKey.lobbyWatcher, [
                interaction.guildId,
            ]);
            const settings = (yield redis_1.redis.get(settingsKey));
            yield redis_1.redis.set(settingsKey, Object.assign(Object.assign({}, settings), { paused: false, forceUpdate: true }));
        });
    },
};
