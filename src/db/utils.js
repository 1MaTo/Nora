export const parseMapName = (map) => {
    const indexOfLastBackSlash = map.lastIndexOf("\\") + 1;
    const indexOfMapFileType = map.lastIndexOf(".w3x");
    return map.slice(indexOfLastBackSlash, indexOfMapFileType);
};

export const wc3MapConfigs = [
    {
        name: "fbt",
        slots: 10,
    },
];

export const getMapConfig = (mapName) => {
    const mapConfig = wc3MapConfigs.find((map) =>
        mapName.match(new RegExp(map.name, "gi"))
    );
    return mapConfig;
};

export const parseUserNames = (userNamesRaw) => {
    const cleanedUserNames = userNamesRaw.replace(/\t+/g, " ").trim();
    //  TODO add more parsers
    return cleanedUserNames;
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
        const mapConfig = getMapConfig(formatMapName);
        const userNames = parseUserNames(game.usernames);
        const mapTotalSlots = mapConfig.slots || game.slotstotal;
        lobby.push({
            name: game.gamename,
            owner: game.ownername,
            host: game.creatorname,
            map: formatMapName,
            users: userNames,
            slots: mapTotalSlots,
            slotsTaken: game.slotstaken - (game.slotstotal - mapTotalSlots),
        });
    });
    if (!lobby.length) return null;
    return lobby;
};
