type mapConfig = {
  name: string;
  guildID: string;
  options: mapConfigOption;
  slots: number;
  slotMap: Array<mapConfigSlotMap>;
};

type mapConfigOption = {
  ranking: boolean;
  spectatorLivesMatter: boolean;
  mapImage: string | undefined;
};

type mapConfigSlotMap = {
  name: string;
  slots: number;
};

type lobbyTable = {
  name: string;
  server: string;
  ping: string;
  winrate: string;
};

const enum optionLobbyField {
  server = "server",
  winrate = "winrate",
}

type lobbyGame = {
  id: number;
  botid: number;
  gamename: string;
  ownername: string;
  creatorname: string;
  map: string;
  slotstotal: number;
  slotstaken: number;
  usernames: string;
  totalgames: number;
  totalplayers: number;
};

type lobbyInfo<T> = {
  botid: number;
  gamename: string;
  owner: string;
  host: string;
  mapname: string;
  players: T;
  slots: number;
  slotsTaken: number;
  mapImage: string | undefined;
};

type lobbyStrings = {
  nicks: string;
  pings: string;
  option: {
    fieldName: string;
    string: string;
  };
};

type lobbyWatcherInfo = {
  startTime: number;
  delay: number;
  guildID: string;
  channelID: string;
  headerID: string | undefined;
  lobbysID: Array<lobbyWatcherLobyMessageInfo>;
};

type lobbyWatcherLobyMessageInfo = {
  messageID: string;
  startTime: number;
  botID: number;
};
