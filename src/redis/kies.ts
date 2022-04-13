export const groupsKey = {
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

export const keyDivider = "#@$@#$@#";

export const redisKey = {
  struct: (groupKey: string, kies: Array<string>) =>
    [groupKey, ...kies].join(keyDivider),
  destruct: (key: string) => key.split(keyDivider).slice(1),
};
