import { dbErrors, statsCommand } from "../strings/logsMessages";
import { fbtSettings } from "../../config.json";
import { logError, autodeleteMsg, uniqueFromArray, guildUserRedisKey } from "../utils";
import { getGamesCount } from "../db/statsQueries";
import { searchMapConfig, getGamesResults } from "../db/db";
import { parseMapName } from "../db/utils";
import { totalGamesForNicknames, userWinRate } from "../strings/embeds";
import { objectKey } from "../redis/objects";
import { redis } from "../redis/redis";

export const name = "stats";
export const args = 0;
export const aliases = ["s"];
export const usage = "<total games(or tg) | winrate(or wr)> |<nickname>|<nickname>|...";
export const description = "Various statistics, using map FBT, to override map use <mapName> as first argument";
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

    switch (statWord) {
        case "tg":
        case "total games":
            const games = await totalGames(guildId, nicknames);
            if (!games) return autodeleteMsg(message, statsCommand.noGamesForThisNickname(nicknames));
            const groupedGamesdata = groupGamesWithConfig(games);
            return autodeleteMsg(message, { embed: totalGamesForNicknames(nicknames, groupedGamesdata) }, 20000);
        case "winrate":
        case "wr":
            const results = await calculateUserWinrate(nicknames);
            if (!results) return autodeleteMsg(message, statsCommand.noGamesForThisNickname(nicknames));
            watchStatsMessage(message, results);
            return true;
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

const calculateUserWinrate = async nicknames => {
    const games = await getGamesResults();
    if (!games) return null;
    const groupedGames = games.reduce((map, user) => {
        return map.set(user.gameid, [
            ...(map.get(user.gameid) || []),
            { nickname: user.name, win: Boolean(Number(user.win)) },
        ]);
    }, new Map());
    const winRates = {
        user: {},
        teammates: {},
        enemies: {},
    };
    groupedGames.forEach((users, _) => {
        if (users.some(user => nicknames.includes(user.nickname))) {
            const userGameResult = users.find(user => nicknames.includes(user.nickname)).win;
            users.forEach(user => {
                const userType = nicknames.includes(user.nickname) ? "user" : "teammates";

                if (user.win !== userGameResult) {
                    if (!winRates["enemies"][user.nickname]) winRates["enemies"][user.nickname] = { win: 0, lose: 0 };

                    if (user.win) {
                        winRates["enemies"][user.nickname].win++;
                    } else {
                        winRates["enemies"][user.nickname].lose++;
                    }
                    return;
                }

                if (!winRates[userType][user.nickname]) winRates[userType][user.nickname] = { win: 0, lose: 0 };

                if (user.win) {
                    winRates[userType][user.nickname].win++;
                } else {
                    winRates[userType][user.nickname].lose++;
                }
            });
        }
    });
    winRates.user = Object.entries(winRates.user).reduce(
        (arr, user) => {
            return {
                nicknames: [...arr.nicknames, user[0]],
                win: arr.win + user[1].win,
                lose: arr.lose + user[1].lose,
            };
        },
        { nicknames: [], win: 0, lose: 0 }
    );
    winRates.user.percent = Math.round((winRates.user.win / (winRates.user.win + winRates.user.lose)) * 100);
    winRates.teammates = Object.entries(winRates.teammates)
        .reduce((users, user) => {
            return [
                ...users,
                {
                    nickname: user[0],
                    ...user[1],
                    percent: Math.floor((user[1].win / (user[1].win + user[1].lose)) * 100),
                },
            ];
        }, [])
        .sort(sortByGamesCount);

    winRates.enemies = Object.entries(winRates.enemies)
        .reduce((users, user) => {
            return [
                ...users,
                {
                    nickname: user[0],
                    ...user[1],
                    percent: Math.floor((user[1].win / (user[1].win + user[1].lose)) * 100),
                },
            ];
        }, [])
        .sort(sortByGamesCount);
    return winRates;
};

const watchStatsMessage = async (message, stats) => {
    const entityOnPage = 7;
    const userId = message.author.id;
    const channel = message.channel;
    let maxEntities = stats.teammates.length;
    let maxPage = Math.ceil(maxEntities / entityOnPage);
    let currentPage = 0;
    let teammatesMode = true;
    let sortMethod = {
        func: sortByGamesCount,
        name: `most games played ${teammatesMode ? "with" : "against"} you`,
    };

    const constructEmbed = () => {
        return {
            embed: userWinRate({
                teammatesMode,
                sortMethod: sortMethod.name,
                totalTeammates: stats.teammates.length,
                user: stats.user,
                teammates: [...stats[teammatesMode ? "teammates" : "enemies"]]
                    .sort(sortMethod.func)
                    .splice(currentPage * entityOnPage, entityOnPage),
                page: currentPage + 1,
                maxPage,
            }),
        };
    };

    const board = await channel.send(constructEmbed());
    board.react("⬅");
    board.react("➡");
    board.react("1️⃣");
    board.react("2️⃣");
    board.react("🔄");
    board.react("❌");

    const filter = (reaction, user) => user.id === userId;
    const collector = board.createReactionCollector(filter, { time: 180000 });

    collector.on("collect", r => {
        r.users.remove(userId);
        switch (r.emoji.name) {
            case "⬅":
                if (currentPage === 0) return;
                currentPage--;
                board.edit(constructEmbed());
                break;
            case "➡":
                if (currentPage === maxPage) return;
                currentPage++;
                board.edit(constructEmbed());
                break;
            case "1️⃣":
                sortMethod = {
                    func: sortByGamesCount,
                    name: `most games played ${teammatesMode ? "with" : "against"} you`,
                };
                board.edit(constructEmbed());
                break;
            case "2️⃣":
                sortMethod = {
                    func: sortByPercent,
                    name: `most winrate ${teammatesMode ? "with you in team" : "against you"}`,
                };
                board.edit(constructEmbed());
                break;
            case "🔄":
                currentPage = 0;
                maxPage = Math.ceil(maxEntities / entityOnPage);
                teammatesMode = !teammatesMode;
                sortMethod = {
                    func: sortByGamesCount,
                    name: `most games played ${teammatesMode ? "with" : "against"} you`,
                };
                board.edit(constructEmbed());
                break;
            case "❌":
                message.delete();
                board.delete();
                break;
        }
    });

    collector.on("end", collected => {
        message.delete;
        board.delete();
    });
};

const sortByGamesCount = (a, b) => b.win + b.lose - (a.win + a.lose);
const sortByPercent = (a, b) => b.percent - a.percent;
