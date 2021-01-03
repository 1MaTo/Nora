import { dbErrors, statsCommand } from "../strings/logsMessages";
import { fbtSettings } from "../../config.json";
import { logError, autodeleteMsg, uniqueFromArray, guildUserRedisKey } from "../utils";
import { getGamesCount } from "../db/statsQueries";
import { searchMapConfig } from "../db/db";
import { parseMapName } from "../db/utils";
import { totalGamesForNicknames } from "../strings/embeds";
import { objectKey } from "../redis/objects";
import { redis } from "../redis/redis";

export const name = "stats";
export const args = 0;
export const aliases = ["s"];
export const usage = "<total games> |<nickname>|<nickname>|...";
export const description =
    "Various statistics, by default using map FBT, to override map use <mapName> as first argument";
export const guildOnly = true;
export const caseSensitive = true;

export const run = async (message, args) => {
    const commandArgs = args.join(" ").split("|");
    const guildId = message.guild.id;
    const defaultMap = "fbt";
    const userId = message.author.id;
    const statWord = commandArgs.shift().trim();

    if (!statWord) return autodeleteMsg(message, statsCommand.badStatWord);

    let nicknames = commandArgs;

    if (!nicknames.length) {
        const redisKey = guildUserRedisKey.struct(objectKey.bindNickname, guildId, userId);
        nicknames = await redis.get(redisKey);
    }

    if (!nicknames) return autodeleteMsg(message, statsCommand.badNicknames);

    console.log(commandArgs);

    switch (statWord) {
        case "tg":
        case "total games":
            const games = await totalGames(guildId, nicknames);
            if (!games) return autodeleteMsg(message, statsCommand.noGamesForThisNickname(nicknames));
            const groupedGamesdata = groupGamesWithConfig(games);
            return autodeleteMsg(message, { embed: totalGamesForNicknames(nicknames, groupedGamesdata) }, 20000);
        default:
            return autodeleteMsg(message, statsCommand.badStatWord);
    }
};

const totalGames = async (guildId, nicknames) => {
    let games = await getGamesCount(nicknames);
    if (!games) return null;
    const filterSpectators = games.map(async game => {
        const config = await searchMapConfig(guildId, game.map);

        if (!config) return game;

        const spectatorTeam = config.slotMap.findIndex(team => team.name.toLowerCase() === "spectators");

        const noSpecGames = game.teams.reduce((arr, team, index) => {
            return Number(team) === Number(spectatorTeam) ? arr : [...arr, index];
        }, []);

        if (!noSpecGames.length) {
            return null;
        }

        return {
            gamesCount: noSpecGames.length,
            map: config.name,
            gamesId: game.gamesId.filter((id, index) => noSpecGames.includes(index)),
            teams: game.teams.filter((team, index) => noSpecGames.includes(index)),
            mapVersion: game.map,
        };
    });

    games = (await Promise.all(filterSpectators)).filter(game => game !== null);

    if (!games.length) return null;

    return games;
};

const groupGamesWithConfig = games => {
    const maps = uniqueFromArray(games.map(game => game.map));

    const groupedGames = maps.reduce((arr, mapName) => {
        const allMaps = games.filter(game => game.map === mapName);
        return [
            ...arr,
            {
                map: mapName,
                totalGames: allMaps.reduce((count, game) => Number(count) + Number(game.gamesCount), 0),
                versions: allMaps.map(map => {
                    return {
                        gamesCount: map.gamesCount,
                        /* gamesId: map.gamesId,
                        teams: map.teams, */
                        mapVersion: map.mapVersion || mapName,
                    };
                }),
            },
        ];
    }, []);

    return {
        totalGameCount: groupedGames.reduce((count, group) => count + group.totalGames, 0),
        groupedGames,
    };
};
