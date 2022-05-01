"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisKey = exports.keyDivider = exports.groupsKey = void 0;
exports.groupsKey = {
    bindNickname: "USER_BIND_NICKNAME_KEY_",
    lobbyWatcher: "GUILD_LOBBY_WATCHER",
    lobbyGameWatcher: "GUILD_LOBBY_WATCHER_GAME",
    gameStats: "GUILD_GAME_STATS",
    mapConfig: "GUILD_MAP_CONFIG",
    commandLog: "GUILD_COMMAND_LOG",
    uploadingMap: "GUILD_UPLOADING_MAP",
    yandexIAMToken: "YANDEX_IAM_TOKEN",
    reportLog: "BOT_REPORT_LOG",
};
exports.keyDivider = "#@$@#$@#";
exports.redisKey = {
    struct: (groupKey, kies) => [groupKey, ...kies].join(exports.keyDivider),
    destruct: (key) => key.split(exports.keyDivider).slice(1),
};
