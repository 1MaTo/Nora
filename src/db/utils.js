import { EMPTY_LOBBY_STATS, EMPTY_LOBBY_USER_NAME, SPACE } from "../strings/constants";

export const parseMapName = (map) => {
    const indexOfLastBackSlash = map.lastIndexOf("\\") + 1;
    const indexOfMapFileType = map.lastIndexOf(".w3x");
    return map.slice(indexOfLastBackSlash, indexOfMapFileType);
};

export const wc3MapConfigs = [
    {
        name: "fbt",
        slots: 10,
        slotMap: [4, 4, 2],
    },
    {
        name: "aniki",
        slots: 10,
        slotMap: [4, 4, 2],
    }

];

export const getMapConfig = (mapName) => {
    const mapConfig = wc3MapConfigs.find((map) =>
        mapName.match(new RegExp(map.name.toLowerCase(), "gi"))
    );
    return mapConfig;
};

export const parseUserNames = (userNamesRaw, totalSlots, slotsMap) => {
    const cleanedUsersLobby = userNamesRaw.split("\t").map((field) => {
        if (field === "") return EMPTY_LOBBY_STATS;
        return field;
    });
    const usersMass = [...Array(totalSlots).keys()].map(() => {
        return {
            name: cleanedUsersLobby.shift() || EMPTY_LOBBY_STATS,
            server: cleanedUsersLobby.shift() || EMPTY_LOBBY_STATS,
            ping: cleanedUsersLobby.shift() || EMPTY_LOBBY_STATS,
        };
    });
    if (!usersMass.some((user) => user.name !== EMPTY_LOBBY_STATS)) return null;
    let slotsSumm = 0;
    slotsMap.reverse().forEach((slots) => {
        slotsSumm = slotsSumm + slots;
        if (slotsSumm === totalSlots) return;
        usersMass.splice(totalSlots - slotsSumm, 0, {
            name: SPACE,
            server: SPACE,
            ping: SPACE,
        });
    });
    console.log(usersMass)
    let nicks = "";
    let pings = "";
    let servers = "";
    usersMass.forEach((player) => {
        nicks += player.name === EMPTY_LOBBY_STATS ? EMPTY_LOBBY_USER_NAME + "\n" : player.name + "\n";
        pings +=
            player.ping !== SPACE && player.name !== EMPTY_LOBBY_STATS
                ? player.ping + "ms" + "\n"
                : player.ping + "\n";
        servers += player.server + "\n";
    });
    //  TODO add more parsers
    return { nicks, pings, servers };
};

export const parseGameListResults = (results) => {
    const lobby = [];
    results.forEach((game) => {
        if (
            game.gamename === "" &&
            game.ownername === "" &&
            game.creatorname === ""
        ) {
            return null;
        }
        const formatMapName = parseMapName(game.map);
        const mapConfig = getMapConfig(formatMapName) || { slots: game.slotstotal, slotMap: [game.slotstotal]};
        const mapTotalSlots = mapConfig.slots || game.slotstotal;
        const slotsMap = mapConfig.slotMap || mapTotalSlots;
        const lobbyPlayers = parseUserNames(
            game.usernames,
            mapTotalSlots,
            slotsMap
        );
        lobby.push({
            name: game.gamename,
            owner: game.ownername,
            host: game.creatorname,
            map: formatMapName,
            users: lobbyPlayers,
            slots: mapTotalSlots,
            slotsTaken: game.slotstaken - (game.slotstotal - mapTotalSlots),
        });
    });
    if (!lobby.length) return null;
    return lobby;
};
