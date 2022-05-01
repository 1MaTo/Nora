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
exports.pingUsersOnStart = void 0;
const response_1 = require("../embeds/response");
const lobbyParser_1 = require("./lobbyParser");
const nicknameToDiscordUser_1 = require("./nicknameToDiscordUser");
const pingUsersOnStart = (game, guildID) => __awaiter(void 0, void 0, void 0, function* () {
    const nicknames = game.players.map((player) => player.name.substr(lobbyParser_1.USER_LOBBY_PREFIX.length));
    const users = (yield (0, nicknameToDiscordUser_1.getDiscordUsersFromNicknames)(nicknames, guildID)).filter((user) => user.settings.ping_on_start);
    users.map((user) => user.user.send({ embeds: [(0, response_1.info)("Game started")] }));
});
exports.pingUsersOnStart = pingUsersOnStart;
