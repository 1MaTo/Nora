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

type lobbyWatcherUpdateInfo = {
  forceUpdate?: boolean;
  lastLoadedMap?: string;
  nextExecuteKey?: number;
  pauseKey?: number;
  paused?: boolean;
  botid?: number;
  delay?: number;
  guildID?: string;
  channelID?: string;
  headerID?: string | undefined;
  activeLobbyCount?: number;

  lobbysID?: lobbyWatcherLobyMessageInfo[];
  startTime?: number;
};

type lobbyWatcherInfo = {
  forceUpdate?: boolean;
  lastLoadedMap?: string;
  paused: boolean;
  botid: number;
  delay: number;
  guildID: string;
  channelID: string;
  headerID: string | undefined;
  activeLobbyCount: number;

  lobbysID: lobbyWatcherLobyMessageInfo[];
  startTime: number;
};

type lobbyGameWatcherInfo = {
  paused: boolean;
  msgId: string;
  botid: number;
  delay: number;
  lobbyHash: string;
};

type lobbyWatcherLobyMessageInfo = {
  messageID: string;
  startTime: number;
  botID: number;
  lobbyHash: string;
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
  lobbyWatcherConfigLoaded = "lobby-watcher-config-loaded",
  lobbyWatcherConfigError = "lobby-watcher-config-error",
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

type DataToTranslate = {
  str: string;
  itemList: [key: string, value: string][];
};

type YandexLanguageCodeList =
  | "az"
  | "sq"
  | "am"
  | "en"
  | "ar"
  | "hy"
  | "af"
  | "eu"
  | "ba"
  | "be"
  | "bn"
  | "my"
  | "bg"
  | "bs"
  | "cy"
  | "hu"
  | "vi"
  | "ht"
  | "gl"
  | "nl"
  | "el"
  | "ka"
  | "gu"
  | "da"
  | "he"
  | "yi"
  | "id"
  | "ga"
  | "it"
  | "is"
  | "es"
  | "kk"
  | "kn"
  | "ca"
  | "ky"
  | "zh"
  | "ko"
  | "xh"
  | "km"
  | "lo"
  | "la"
  | "lv"
  | "lt"
  | "lb"
  | "mg"
  | "ms"
  | "ml"
  | "mt"
  | "mk"
  | "mi"
  | "mr"
  | "mn"
  | "de"
  | "ne"
  | "no"
  | "pa"
  | "fa"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "sr"
  | "si"
  | "sk"
  | "sl"
  | "sw"
  | "su"
  | "tg"
  | "th"
  | "tl"
  | "ta"
  | "tt"
  | "te"
  | "tr"
  | "uz"
  | "uk"
  | "ur"
  | "fi"
  | "fr"
  | "hi"
  | "hr"
  | "cs"
  | "sv"
  | "gd"
  | "et"
  | "eo"
  | "jv"
  | "ja";

type YandexTranslateRequest = {
  texts: string[];
  targetLanguageCode: YandexLanguageCodeList;
  sourceLanguageCode?: YandexLanguageCodeList;
  speller?: boolean;
};

type YandexTranslateResponse = {
  translations: {
    text: string;
    detectedLanguageCode: string;
  }[];
};

type YandexLanguageListResponse = {
  languages: {
    code: string;
    name: string;
  }[];
};
