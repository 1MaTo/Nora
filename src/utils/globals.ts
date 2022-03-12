export const production: boolean = process.env.NODE_ENV === "production";
export const withLogs: boolean = process.env.LOGS === "true";

export const palette = {
  green: "#23911e",
  red: "#bb1616",
  blue: "#245abb",
  yellow: "#c5c510",
  black: "#000001",
};

export const ghostCmd = {
  pendingTimeout: 3000,
  requestInterval: 500,
  deleteMessageTimeout: 4000,
};

export const msgDeleteTimeout = {
  short: 3000,
  default: 5000,
  long: 10000,
  info: 120000,
};

export const msgEditTimeout = {
  short: 2000,
};

export const ghostApiTimeout = 5000;

export const guildIDs = {
  ghostGuild: "408947483763277825",
  debugGuild: "556150178147467265",
};

export const ownerID = "245209137103896586";

export const stats = {
  gamesToBeRanked: 1,
};

export const botStatusVariables = {
  lobbyCount: 0,
  gameCount: 0,
  ghost: false,
};

export const numberToEmoji = (number: number) => {
  switch (number) {
    case 0:
      return "0️⃣";
    case 1:
      return "1️⃣";
    case 2:
      return "2️⃣";
    case 3:
      return "3️⃣";
    case 4:
      return "4️⃣";
    case 5:
      return "5️⃣";
    case 6:
      return "6️⃣";
    case 7:
      return "7️⃣";
    case 8:
      return "8️⃣";
    case 9:
      return "9️⃣";
    case 10:
      return "🔟";
    default:
      return `${number}`;
  }
};

export const defaultUserData = { ping_on_start: false } as userDataSettings;

export const optionLobbyFieldToTitle = {
  [optionLobbyField.server]: "server",
  [optionLobbyField.winrate]: "W | T | S",
};

export const commandLogsMaxCount = 50;

export const buttonId = {
  hostGame: "lobby-watcher_button_host-game",
  unhostGame: "lobby-watcher_button_unhost-game",
  hostGameAnywhere: "nora_button_host-game",
};

export const selectMenuId = {
  selectMapConfig: "ghost_select_load-map-config",
};

export const ghostGuildBotId = 2;

export const ghostCommandsMarks = {
  load: {
    success: /loading MPQ file/i,
    error: /warning - unable to load MPQ file/i,
  },
  map: {
    success: /loading MPQ file/i,
    error: /warning - unable to load MPQ file/i,
  },
  pub: { success: /creating game/i, error: null },
  unhost: { success: /deleting current game/i, error: null },
  start: { success: null, error: null },
};
