import {
    EMPTY_LOBBY_SERVER,
    EMPTY_LOBBY_STATS,
    EMPTY_LOBBY_USER_NAME,
    EMPTY_LOBBY_WINRATE,
    EPMTY_LOBBY_PING,
    SPACE,
} from "../strings/constants";
import { searchMapConfigOrDefault } from "./db";
import { fbtSettings } from "../../config.json";
import { getPlayerWinrate } from "./statsQueries";

export const parseMapName = map => {
    const indexOfLastBackSlash = map.lastIndexOf("\\") + 1;
    const indexOfMapFileType = map.lastIndexOf(".w3x");
    return map.slice(indexOfLastBackSlash, indexOfMapFileType);
};

export const parseUserNames = async (userNamesRaw, totalSlots, slotsMap, map, ranking) => {
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
            winrate: SPACE,
        });
    });
    //  Rename fields if needed
    const completeMass = await Promise.all(
        usersMass.map(async user => {
            //  If this is empty string just return all object without editing
            if (user.name === SPACE || user.ping === SPACE) {
                return user;
            }
            //  Change ping
            const ping = user.ping === EMPTY_LOBBY_STATS ? EPMTY_LOBBY_PING : user.ping + "ms";

            //  Change username
            const name = user.name === EMPTY_LOBBY_STATS ? EMPTY_LOBBY_USER_NAME : user.name;

            //  Change server
            const server = user.server === EMPTY_LOBBY_STATS ? EMPTY_LOBBY_SERVER : user.server;

            //  Add winrate
            if (!ranking) return { name, ping, server, winrate };

            const isWinrate = await getPlayerWinrate([user.name], map);

            const winrate =
                user.ping === EMPTY_LOBBY_STATS ? EMPTY_LOBBY_STATS : isWinrate ? `${isWinrate}%` : EMPTY_LOBBY_WINRATE;

            return { name, ping, server, winrate };
        })
    );
    //  Make strings for embed
    let nicks = "";
    let pings = "";
    let winrates = "";
    let servers = "";
    completeMass.forEach(player => {
        nicks += player.name + "\n";
        pings += player.ping + "\n";
        winrates += player.winrate + "\n";
        servers += player.server + "\n";
    });
    return {
        nicks,
        pings,
        optionField: ranking ? { title: "Winrate", fields: winrates } : { title: "Server", fields: servers },
    };
};

export const getLobbyTable = (userNamesRaw, totalSlots, slotsMap) => {
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
    return completeMass;
};

export const buildGameResult = async (guildId, game) => {
    if (game.gamename === "" && game.ownername === "" && game.creatorname === "") {
        return null;
    }
    const config = await searchMapConfigOrDefault(guildId, game);
    const mapTotalSlots = config.slots;
    const slotsMap = config.slotMap;
    const lobbyPlayers = await parseUserNames(
        game.usernames,
        mapTotalSlots,
        [...slotsMap],
        config.name || config.mapName,
        Boolean(config.options.ranking === "true")
    );
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

export const countPlayersInLobby = async (guildId, usernames, mapName, slotstaken, slotstotal) => {
    const config = await searchMapConfigOrDefault(guildId, { map: mapName, slotstotal });
    const table = getLobbyTable(usernames, config.slots, [...config.slotMap]);
    const hasSpectators = config.slotMap.find(item => item.name.toLowerCase() === "spectators");
    if (config.options.spectatorLivesMatter === "true" || !table)
        return slotstaken - (slotstotal - Number(config.slots));
    if (hasSpectators) {
        const specIndex = table.findIndex(
            player =>
                player.name.replaceAll("`", "").toLowerCase() === "spectators" &&
                player.ping === SPACE &&
                player.server === SPACE
        );
        const specPlayers = table.slice(specIndex + 1, specIndex + Number(hasSpectators.slots) + 1);
        const actualSpecPlayer = specPlayers.reduce((summ, player) => {
            return (
                summ +
                (player.name === EMPTY_LOBBY_USER_NAME &&
                player.ping === EPMTY_LOBBY_PING &&
                player.server === EMPTY_LOBBY_SERVER
                    ? 0
                    : 1)
            );
        }, 0);
        return slotstaken - (slotstotal - Number(config.slots)) - actualSpecPlayer;
    }
    return slotstaken - (slotstotal - Number(config.slots));
};
