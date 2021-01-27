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

enum optionLobbyField {
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

type lobbyInfo = {
  botid: number;
  gamename: string;
  owner: string;
  host: string;
  mapname: string;
  players: Array<lobbyTable>;
  slots: number;
  slotsTaken: number;
};
