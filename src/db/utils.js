import { EMPTY_LOBBY_SERVER, EMPTY_LOBBY_STATS, EMPTY_LOBBY_USER_NAME, EPMTY_LOBBY_PING, SPACE } from "../strings/constants";

export const parseMapName = (map) => {
    const indexOfLastBackSlash = map.lastIndexOf("\\") + 1;
    const indexOfMapFileType = map.lastIndexOf(".w3x");
    return map.slice(indexOfLastBackSlash, indexOfMapFileType);
};

export const wc3MapConfigs = [
    {
        name: "fbt",
        slots: 10,
        slotMap: [{slots: 4, name: "Team 1"}, {slots: 4, name: "Team 2"}, {slots: 2, name: "Spectators"}],
    },
    {
        name: "aniki",
        slots: 10,
        slotMap: [{slots: 4, name: "Team 1"}, {slots: 4, name: "Team 2"}, {slots: 2, name: "Spectators"}],
    },
];

export const getMapConfig = (mapName) => {
    const mapConfig = wc3MapConfigs.find((map) =>
        mapName.match(new RegExp(map.name.toLowerCase(), "gi"))
    );
    return mapConfig;
};

export const parseUserNames = (userNamesRaw, totalSlots, slotsMap) => {
    //  Clean up from tabs and fill with empty symbols
    const cleanedUsersLobby = userNamesRaw.split("\t").map((field) => {
        if (field === "") return EMPTY_LOBBY_STATS;
        return field;
    });
    //  Get values from massive or fill with epmty symbols to full lobby
    const usersMass = [...Array(totalSlots).keys()].map(() => {
        return {
            name: cleanedUsersLobby.shift() || EMPTY_LOBBY_STATS,
            server: cleanedUsersLobby.shift() || EMPTY_LOBBY_STATS,
            ping: cleanedUsersLobby.shift() || EMPTY_LOBBY_STATS,
        };
    });
    //  If no usernames => lobby empty, just return null
    if (!usersMass.some((user) => user.name !== EMPTY_LOBBY_STATS)) return null;
    //  Past epmty strings in massive to split lobby according to map
    let slotsSumm = 0;
    slotsMap.reverse().forEach(({slots, name}) => {
        slotsSumm = slotsSumm + slots;
        if (slotsSumm > totalSlots) return;
        usersMass.splice(totalSlots - slotsSumm, 0, {
            name: `\`${name}\``,
            server: SPACE,
            ping: SPACE,
        });
    });
    //  Rename fields if needed
    const completeMass = usersMass.map(user => {
        //  If this is empty string just return all object without editing
        if (user.name === SPACE || user.ping === SPACE || user.server === SPACE) {
            return user
        }
        //  Change ping
        const ping = user.ping === EMPTY_LOBBY_STATS ? EPMTY_LOBBY_PING : user.ping + "ms"
        //  Change username
        const name = user.name === EMPTY_LOBBY_STATS ? EMPTY_LOBBY_USER_NAME : user.name
        //  Change server
        const server = user.server === EMPTY_LOBBY_STATS ? EMPTY_LOBBY_SERVER : user.server
        return {name, ping, server}
    })
    //  Make strings for embed 
    let nicks = "";
    let pings = "";
    let servers = "";
    completeMass.forEach((player) => {
        nicks += player.name + "\n";
        pings += player.ping + "\n";
        servers += player.server + "\n";
    });
    return { nicks, pings, servers };
};

export const parseGameListResults = (results) => {
    const lobby = [];
    results.forEach((game) => {
        //  If lobby empty just return
        if (game.gamename === "" && game.ownername === "" && game.creatorname === "") {
            return null;
        }
        //  Default map config
        const defaultMapConfig = {
            slots: game.slotstotal, 
            slotMap: [{slots: game.slotstotal, name: "Lobby"}],
        }
        const formatMapName = parseMapName(game.map);
        const mapConfig = getMapConfig(formatMapName) || defaultMapConfig;
        const mapTotalSlots = mapConfig.slots;
        const slotsMap = mapConfig.slotMap;
        const lobbyPlayers = parseUserNames(
            game.usernames,
            mapTotalSlots,
            [...slotsMap]
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
