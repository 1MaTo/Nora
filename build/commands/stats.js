"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const slash_create_1 = require("slash-create");
const stats_1 = require("../commandsObjects/stats");
const queries_1 = require("../db/queries");
const response_1 = require("../embeds/response");
const stats_2 = require("../embeds/stats");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const discordMessage_1 = require("../utils/discordMessage");
const globals_1 = require("../utils/globals");
const mapConfig_1 = require("../utils/mapConfig");
const MMDstats_1 = require("../utils/MMDstats");
const nicknameToDiscordUser_1 = require("../utils/nicknameToDiscordUser");
const uniqueFromArray_1 = require("../utils/uniqueFromArray");
class stats extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, stats_1.statsCommand);
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && ctx.member.id !== globals_1.ownerID)
                return;
            if (ctx.options.totalgames) {
                const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [
                    ctx.guildID,
                    ctx.member.id,
                ]);
                const user = (yield redis_1.redis.get(key));
                const nickName = ctx.options.totalgames["nickname"] || (user && user.nickname);
                if (!nickName) {
                    yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.warning("No nickname") }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                const games = yield getTotalGamesStats(ctx.guildID, nickName);
                if (!games) {
                    yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.warning(`No games for ${nickName}`) }, globals_1.msgDeleteTimeout.long);
                    return;
                }
                const groupedGamesData = getGroupedGamesWithConfig(games);
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: stats_2.totalGamesForNickname(nickName, groupedGamesData),
                }, globals_1.msgDeleteTimeout.long);
                return;
            }
            if (ctx.options.winrate) {
                const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [
                    ctx.guildID,
                    ctx.member.id,
                ]);
                const user = (yield redis_1.redis.get(key));
                const nickname = ctx.options.winrate["nickname"] || (user && user.nickname);
                if (!nickname) {
                    yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.warning("No nickname") }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                const stats = yield MMDstats_1.getWinStats(nickname);
                if (!stats) {
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.warning("No games for this nicknames"),
                    }, globals_1.msgDeleteTimeout.default);
                }
                const member = yield nicknameToDiscordUser_1.getDiscordUsersFromNicknames([nickname], ctx.guildID);
                sendWinrateInteractiveEmbed(ctx.channelID, ctx.member.id, stats, member[0] &&
                    member[0].user.avatarURL({ format: "png", dynamic: true, size: 512 }));
                return;
            }
            if (ctx.options.damage) {
                const damageStats = yield MMDstats_1.getLeaderBordByDamage();
                if (!damageStats) {
                    yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.warning("No players for stats") }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                yield discordMessage_1.sendResponse(ctx.channelID, { embed: stats_2.leaderboardDamage(damageStats) }, globals_1.msgDeleteTimeout.info);
            }
            return;
        });
    }
}
exports.default = stats;
const getTotalGamesStats = (guildID, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield queries_1.getGamesCountInfo(nickname);
    if (!games)
        return null;
    const filterSpectators = yield Promise.all(games.map((game) => __awaiter(void 0, void 0, void 0, function* () {
        const config = yield mapConfig_1.searchMapConfigByMapName(game.map, guildID);
        if (!config)
            return game;
        const spectatorTeam = config.slotMap.findIndex((team) => team.name.toLowerCase() === "spectators");
        const noSpecGames = game.teams.reduce((arr, team, index) => {
            return team === spectatorTeam ? arr : [...arr, index];
        }, []);
        if (!noSpecGames.length) {
            return null;
        }
        return {
            gamesCount: noSpecGames.length,
            map: config.name,
            gamesId: game.gamesID.filter((_, index) => noSpecGames.includes(index)),
            teams: game.teams.filter((_, index) => noSpecGames.includes(index)),
            mapVersion: game.map,
        };
    })));
    const actualGames = filterSpectators.filter((game) => game !== null);
    if (!actualGames.length)
        return null;
    return actualGames;
});
const getGroupedGamesWithConfig = (games) => {
    const maps = uniqueFromArray_1.uniqueFromArray(games.map((game) => game.map));
    const groupedGames = maps.reduce((arr, mapName) => {
        const allMaps = games.filter((game) => game.map === mapName);
        return [
            ...arr,
            {
                map: mapName,
                totalGames: allMaps.reduce((count, game) => count + game.gamesCount, 0),
                versions: allMaps.map((map) => {
                    return {
                        gamesCount: map.gamesCount,
                        mapVersion: map.mapVersion || mapName,
                    };
                }),
            },
        ];
    }, []);
    return {
        totalGamesCount: groupedGames.reduce((count, group) => count + group.totalGames, 0),
        groupedGames,
    };
};
const sendWinrateInteractiveEmbed = (channelID, userID, stats, userAvatar) => __awaiter(void 0, void 0, void 0, function* () {
    const itemsOnPage = 7;
    const emojiCommand = {
        prevPage: "⬅",
        nextPage: "➡",
        sortByGames: "1️⃣",
        sortByPercent: "2️⃣",
        switchPlayerType: "🔄",
        closeEmbed: "❌",
    };
    const embedSettings = {
        stats: stats,
        playersType: "teammates",
        sortFunc: sortByPercent,
        sortDescription: "winrate",
        page: 1,
        maxPage: Math.ceil(stats.teammates.length / itemsOnPage),
        itemsOnPage,
        userAvatar,
    };
    const embed = yield discordMessage_1.sendResponse(channelID, {
        embed: stats_2.playerWinrate(embedSettings),
    });
    Object.values(emojiCommand).map((emoji) => embed.react(emoji));
    const userFilter = (reaction, user) => user.id === userID;
    const collector = embed.createReactionCollector(userFilter, { time: 120000 });
    collector.on("collect", (reaction) => {
        reaction.users.remove(userID);
        switch (reaction.emoji.name) {
            case emojiCommand.prevPage:
                if (embedSettings.page === 1)
                    return;
                embedSettings.page--;
                embed.edit({ embed: stats_2.playerWinrate(embedSettings) });
                return;
            case emojiCommand.nextPage:
                if (embedSettings.page === embedSettings.maxPage)
                    return;
                embedSettings.page++;
                embed.edit({ embed: stats_2.playerWinrate(embedSettings) });
                return;
            case emojiCommand.sortByGames:
                if (embedSettings.sortDescription === "games")
                    return;
                embedSettings.sortDescription = "games";
                embedSettings.sortFunc = sortByGamesCount;
                embed.edit({ embed: stats_2.playerWinrate(embedSettings) });
                return;
            case emojiCommand.sortByPercent:
                if (embedSettings.sortDescription === "winrate")
                    return;
                embedSettings.sortDescription = "winrate";
                embedSettings.sortFunc = sortByPercent;
                embed.edit({ embed: stats_2.playerWinrate(embedSettings) });
                return;
            case emojiCommand.switchPlayerType:
                embedSettings.playersType =
                    embedSettings.playersType === "teammates" ? "enemies" : "teammates";
                embedSettings.page = 1;
                embedSettings.maxPage = Math.ceil(stats[embedSettings.playersType].length / itemsOnPage);
                embed.edit({ embed: stats_2.playerWinrate(embedSettings) });
                return;
            case emojiCommand.closeEmbed:
                embed.delete();
                return;
        }
    });
    collector.on("end", (_) => {
        embed.delete();
    });
});
const sortByGamesCount = (a, b) => b.win + b.lose - (a.win + a.lose);
const sortByPercent = (a, b) => b.percent - a.percent;
