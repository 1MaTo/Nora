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

type gamesCountInfo = {
  gamesCount: number;
  gamesID: Array<number>;
  teams: Array<number>;
  map: string;
  mapVersion: string | undefined;
};

type gamesCountGroupedInfo = {
  totalGamesCount: number;
  groupedGames: Array<{
    map: string;
    totalGames: number;
    versions: Array<gamesCountVersions>;
  }>;
};

type gamesCountVersions = {
  gamesCount: number;
  mapVersion: string;
};

const enum botEvent {
  update = "update",
}

const enum optionLobbyField {
  server = "server",
  winrate = "winrate",
}

type gamestatsInfo = {
  guildID: string;
  channelID: string;
  delay: number;
  prevGamesCount: number | undefined;
};

type gameDataByIdsGamestats = {
  id: number;
  map: string;
  datetime: Date;
  gamename: string;
  duration: number;
  winnerTeam: number | null;
  players: Array<{
    teamName: string;
    teamPlayers: Array<{ gameid: number; name: string; team: number }>;
  }>;
};

type userData = {
  discordID: string;
  nickname: string;
  settings: userDataSettings;
};

type userDataSettings = {
  ping_on_start: boolean;
};

type playerWinrateStats = {
  win: number;
  lose: number;
  streak: { type: string; count: number };
};

type fullGameInfo = {
  gameid: number;
  duration: number;
  gameScore: {
    winner?: number;
    loser?: number;
  };
  players: fullPlayerInfo[];
};

type fullPlayerInfo = {
  nickname: string;
  winner: boolean;
  pid: number;
  totalDamage: number;
  kills: number;
  deaths: number;
  heroes: fullHeroInfo;
};

type fullHeroInfo = string;

type playerWinStats = {
  player: {
    nickname: string;
    win: number;
    lose: number;
    percent: number;
  };
  teammates: {
    nickname: string;
    win: number;
    lose: number;
    percent: number;
  }[];
  enemies: {
    nickname: string;
    win: number;
    lose: number;
    percent: number;
  }[];
};

type damageStatsInfo = {
  threshold: number;
  totalDamage: number;
  totalGames: number;
  players: damageStatsPlayerInfo[];
};

type damageStatsPlayerInfo = {
  nickname: string;
  dpr: number;
  totalDmg: number;
  games: number;
  rounds: number;
};
