import { getLobbyList, getPlayerWinrate } from "../db/queries";
import { searchMapConfigByMapName } from "./mapConfig";

export const EMPTY_LOBBY_USER_NAME = "open";
export const EMPTY_LOBBY_DEFAULT = "-";
export const EMPTY_LOBBY_WINRATE = "unranked";
export const SPACE = "‎‏‏‎ ";

export const parseMapName = (mapName: string) =>
  mapName.match(/[^\\]+$/)[0].slice(0, -4);

export const getPlayersTableFromRawString = async (
  rawString: string,
  totalSlots: number,
  slotMap: Array<mapConfigSlotMap>,
  rankMap: boolean,
  mapName: string
): Promise<Array<lobbyTable>> => {
  //  Clean up from tabs and fill with empty symbols
  const rawPlayersString = rawString.split("\t").map((player: string) => {
    if (player === "") return EMPTY_LOBBY_DEFAULT;
    return player;
  });

  //  Get values from massive or fill with epmty symbols to full lobby
  const playersArray = await Promise.all(
    [...Array(totalSlots).keys()].map(async () => {
      const name = rawPlayersString.shift();
      const server = rawPlayersString.shift();
      const ping = rawPlayersString.shift();
      const winrate =
        rankMap && name
          ? await getPlayerWinrate(name, mapName)
          : EMPTY_LOBBY_DEFAULT;
      return {
        name: name || EMPTY_LOBBY_DEFAULT,
        server: server || EMPTY_LOBBY_DEFAULT,
        ping: ping || EMPTY_LOBBY_DEFAULT,
        winrate: winrate || EMPTY_LOBBY_WINRATE,
      };
    })
  );

  //  If no usernames => lobby empty, just return null
  if (!playersArray.some((player) => player.name !== EMPTY_LOBBY_DEFAULT))
    return null;

  //  Inserting teams titles in lobby table
  let slotsSumm = 0;
  slotMap.reverse().forEach(({ slots, name: title }) => {
    slotsSumm = slotsSumm + slots;
    if (slotsSumm > totalSlots) return;
    playersArray.splice(totalSlots - slotsSumm, 0, {
      name: title,
      server: SPACE,
      ping: SPACE,
      winrate: SPACE,
    });
  });

  const lobby = playersArray.map(
    (player): lobbyTable => {
      //  If title, just return w/o editing
      if (player.ping === SPACE) {
        return player;
      }

      //  Change ping
      const ping =
        player.ping === EMPTY_LOBBY_DEFAULT
          ? EMPTY_LOBBY_DEFAULT
          : player.ping + "ms";

      //  Change username
      const name =
        player.name === EMPTY_LOBBY_DEFAULT
          ? EMPTY_LOBBY_USER_NAME
          : player.name;

      const winrate =
        player.winrate === EMPTY_LOBBY_WINRATE
          ? EMPTY_LOBBY_WINRATE
          : `${player.winrate}%`;

      return { ...player, ping, name, winrate };
    }
  );

  return lobby;
};

export const playersLobbyToString = (
  lobbyTable: Array<lobbyTable>,
  optionField: optionLobbyField
) => {
  //  Make strings for embed
  const lobbyFields = lobbyTable.reduce(
    (obj, player) => {
      return {
        nicks: obj.nicks + player.name + "\n",
        pings: obj.pings + player.ping + "\n",
        option: obj.option + player[optionField] + "\n",
      };
    },
    {
      nicks: "",
      pings: "",
      option: "",
    }
  );
  return lobbyFields;
};

export const getFullLobbyInfo = async (guildID: string, game: lobbyGame) => {
  if (
    game.gamename === "" &&
    game.ownername === "" &&
    game.creatorname === ""
  ) {
    return null;
  }
  const mapName = parseMapName(game.gamename);
  const defaultConfig = {
    name: mapName,
    guildID: guildID,
    options: {
      ranking: false,
      spectatorLivesMatter: false,
    },
    slots: game.slotstotal,
    slotMap: [{ slots: game.slotstotal, name: "Lobby" }],
  } as mapConfig;
  const config =
    (await searchMapConfigByMapName(mapName, guildID)) || defaultConfig;
  const lobbyTable = await getPlayersTableFromRawString(
    game.usernames,
    game.slotstotal,
    config.slotMap,
    config.options.ranking,
    config.name
  );

  return {
    botid: game.botid,
    gamename: game.gamename,
    owner: game.ownername,
    host: game.creatorname,
    mapname: config.name,
    players: lobbyTable,
    slots: config.slots,
    slotsTaken: game.slotstaken - (game.slotstotal - config.slots),
  } as lobbyInfo;
};

export const getCurrentLobbies = async (guildID: string) => {
  const rawGames = await getLobbyList();
  const lobbies = (
    await Promise.all(
      rawGames.map(async (game) => getFullLobbyInfo(guildID, game))
    )
  ).filter((lobby) => lobby !== null);
  return lobbies;
};
