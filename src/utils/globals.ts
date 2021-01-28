export const production: boolean = process.env.NODE_ENV === "production";

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
};

export const guildIDs = {
  ghostGuild: "408947483763277825",
  debugGuild: "556150178147467265",
};

export const ownerID = "245209137103896586";

export const stats = {
  gamesToBeRanked: 1,
};
