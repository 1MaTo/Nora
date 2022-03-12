export const groupsKey = {
  bindNickname: "USER_BIND_NICKNAME_KEY_",
  lobbyWatcher: "GUILD_LOBBY_WATCHER",
  gameStats: "GUILD_GAME_STATS",
  mapConfig: "GUILD_MAP_CONFIG",
  commandLog: "GUILD_COMMAND_LOG",
  uploadingMap: "GUILD_UPLOADING_MAP",
};

export const keyDivider = "#@$@#$@#";

export const redisKey = {
  struct: (groupKey: string, kies: Array<string>) =>
    [groupKey, ...kies].join(keyDivider),
  destruct: (key: string) => key.split(keyDivider).slice(1),
};
