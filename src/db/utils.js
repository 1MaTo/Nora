import { EMPTY_LOBBY_SERVER, EMPTY_LOBBY_STATS, EMPTY_LOBBY_USER_NAME, EPMTY_LOBBY_PING, SPACE } from "../strings/constants";
import { searchMapConfig } from "./db";

export const parseMapName = map => {
    const indexOfLastBackSlash = map.lastIndexOf("\\") + 1;
    const indexOfMapFileType = map.lastIndexOf(".w3x");
    return map.slice(indexOfLastBackSlash, indexOfMapFileType);
};

/* export const wc3MapConfigs = [
    {
        name: "fbt",
        slots: 10,
        slotMap: [
            { slots: 4, name: "Team 1" },
            { slots: 4, name: "Team 2" },
            { slots: 2, name: "Spectators" },
        ],
    },
    {
        name: "aniki",
        slots: 10,
        slotMap: [
            { slots: 4, name: "Team 1" },
            { slots: 4, name: "Team 2" },
            { slots: 2, name: "Spectators" },
        ],
    },
]; */

export const getMapConfig = ({ map, slotstotal }) => {
    const mapName = parseMapName(map);
    const mapConfig = wc3MapConfigs.find(map => mapName.match(new RegExp(map.name.toLowerCase(), "gi")));
    const defaultMapConfig = {
        mapName: mapName,
        slots: slotstotal,
        slotMap: [{ slots: slotstotal, name: "Lobby" }],
    };
    return {
        ...defaultMapConfig,
        ...mapConfig,
    };
};

export const parseUserNames = (userNamesRaw, totalSlots, slotsMap) => {
    //  Clean up from tabs and fill with empty symbols
    const cleanedUsersLobby = userNamesRaw.split("\t").map(field => {
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
    if (!usersMass.some(user => user.name !== EMPTY_LOBBY_STATS)) return null;
    //  Past epmty strings in massive to split lobby according to map
    let slotsSumm = 0;
    slotsMap.reverse().forEach(({ slots, name }) => {
        slotsSumm = slotsSumm + Number(slots);
        if (slotsSumm > totalSlots) return;
        usersMass.splice(totalSlots - slotsSumm, 0, {
            name: `\`${name[0].toUpperCase() + name.substr(1)}\``,
            server: SPACE,
            ping: SPACE,
        });
    });
    //  Rename fields if needed
    const completeMass = usersMass.map(user => {
        //  If this is empty string just return all object without editing
        if (user.name === SPACE || user.ping === SPACE || user.server === SPACE) {
            return user;
        }
        //  Change ping
        const ping = user.ping === EMPTY_LOBBY_STATS ? EPMTY_LOBBY_PING : user.ping + "ms";
        //  Change username
        const name = user.name === EMPTY_LOBBY_STATS ? EMPTY_LOBBY_USER_NAME : user.name;
        //  Change server
        const server = user.server === EMPTY_LOBBY_STATS ? EMPTY_LOBBY_SERVER : user.server;
        return { name, ping, server };
    });
    //  Make strings for embed
    let nicks = "";
    let pings = "";
    let servers = "";
    completeMass.forEach(player => {
        nicks += player.name + "\n";
        pings += player.ping + "\n";
        servers += player.server + "\n";
    });
    return { nicks, pings, servers };
};

export const buildGameResult = async (guildId, game) => {
    if (game.gamename === "" && game.ownername === "" && game.creatorname === "") {
        return null;
    }
    //  Default map config
    const config = await searchMapConfig(guildId, game);
    const mapTotalSlots = config.slots;
    const slotsMap = config.slotMap;
    const lobbyPlayers = parseUserNames(game.usernames, mapTotalSlots, [...slotsMap]);
    return {
        botid: game.botid,
        name: game.gamename,
        owner: game.ownername,
        host: game.creatorname,
        map: config.mapName,
        users: lobbyPlayers,
        slots: mapTotalSlots,
        slotsTaken: game.slotstaken - (game.slotstotal - mapTotalSlots),
    };
};

export const parseGameListResults = async (guildId, results) => {
    const buildingResults = results.map(game => buildGameResult(guildId, game));
    const lobbies = await Promise.all(buildingResults);
    const currentLobbies = lobbies.filter(lobby => lobby !== null);
    if (!currentLobbies.length) return null;
    return currentLobbies;
};

/* export const parseGameListResults = results => {
    const lobby = [];
    results.forEach(game => {
        //  If lobby empty just return
        if (game.gamename === "" && game.ownername === "" && game.creatorname === "") {
            return null;
        }
        //  Default map config
        const mapConfig = getMapConfig(game);
        const mapTotalSlots = mapConfig.slots;
        const slotsMap = mapConfig.slotMap;
        const lobbyPlayers = parseUserNames(game.usernames, mapTotalSlots, [...slotsMap]);
        lobby.push({
            botid: game.botid,
            name: game.gamename,
            owner: game.ownername,
            host: game.creatorname,
            map: mapConfig.mapName,
            users: lobbyPlayers,
            slots: mapTotalSlots,
            slotsTaken: game.slotstaken - (game.slotstotal - mapTotalSlots),
        });
    });
    if (!lobby.length) return null;
    return lobby;
}; */

export const countPlayersInLobby = (mapName, slotstaken, slotstotal) => {
    const mapConfig = getMapConfig({ map: parseMapName(mapName), slotstotal });
    return slotstaken - (slotstotal - mapConfig.slots);
};
