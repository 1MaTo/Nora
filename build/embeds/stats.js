"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardDamage = exports.playerWinrate = exports.totalGamesForNickname = void 0;
const colorParsers_1 = require("../utils/colorParsers");
const lobbyParser_1 = require("../utils/lobbyParser");
const stringDecorations_1 = require("../utils/stringDecorations");
const totalGamesForNickname = (nickname, games) => {
    return {
        description: `${games.groupedGames
            .map((group) => {
            if (group.versions.length === 1)
                return `:map: [**${group.totalGames}**] __${group.versions[0].mapVersion}__`;
            return `:map: [**${group.totalGames}**] __${group.map}__\n
            ${group.versions
                .map((version) => `> :small_blue_diamond: [**${version.gamesCount}**] ${version.mapVersion}`)
                .join("\n")}`;
        })
            .join("\n\n")}`,
        color: null,
        author: {
            name: `All games for ${nickname}`,
            icon_url: "https://i.ibb.co/Sv1QcyN/BTN-3.png",
        },
        footer: {
            text: `${games.totalGamesCount} games`,
        },
    };
};
exports.totalGamesForNickname = totalGamesForNickname;
const playerWinrate = ({ stats, playersType, sortFunc, sortDescription, page, maxPage, itemsOnPage, userAvatar, }) => {
    const thumbnail = userAvatar && {
        thumbnail: {
            url: userAvatar,
        },
    };
    return Object.assign({ title: `${stats.player.nickname} 🔸 ${stats.player.percent}% 🔸\n\n[ <:winstreak:812779155334365184> ${stats.player.win} | <:losestreak:812779155418644521> ${stats.player.lose} ]`, description: `‎‏‏${lobbyParser_1.SPACE}\n${playersType === "teammates"
            ? "🤝 __Teammates ranking__ 🤝"
            : "😈 __Enemies ranking__ 😈"}
      
          Most ${sortDescription} ${playersType === "teammates" ? "with you in team" : "against you"}

          ${[...stats[playersType]]
            .sort(sortFunc)
            .splice((page - 1) * itemsOnPage, itemsOnPage)
            .map(({ nickname, win, lose, percent }) => `\`${nickname}\`\n> **${percent}%** 🔸 [ <:winstreak:812779155334365184>  **${win}** |<:losestreak:812779155418644521>**  ${lose}** ]`)
            .join("\n\n")} `, color: colorParsers_1.getWinrateColor(stats.player.percent), author: {
            name: "📝FBT winrate stats 📝",
        }, footer: {
            text: `${stats.player.win + stats.player.lose} games ● ${stats[playersType].length} ${playersType} ● page ${page}/${maxPage}`,
        } }, thumbnail);
};
exports.playerWinrate = playerWinrate;
const leaderboardDamage = (stats) => {
    const [maxDRPlength, maxTotalDamageLength] = stats.players.reduce((prev, player) => {
        return [
            Math.max(prev[0], player.dpr.toLocaleString().length),
            Math.max(prev[1], player.totalDmg.toLocaleString().length),
        ];
    }, [0, 0]);
    return {
        color: "#cc4949",
        fields: [
            {
                name: "FAQ",
                value: `🗡️ *Damage per round*\n⚔️ *Total damage*\n\n\`2x2 and 3x3 only\`\n\n__Games threshold:__ **${stats.threshold}**`,
            },
            {
                name: "#",
                value: stats.players
                    .map((_, index) => `\`${index + 1}\``)
                    .join("\n"),
                inline: true,
            },
            {
                name: "Nickname",
                value: stats.players
                    .map((player) => `\`${player.nickname}\``)
                    .join("\n"),
                inline: true,
            },
            {
                name: "‎‏‏‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ :dagger:     |         :crossed_swords:",
                value: stats.players
                    .map((player) => `\`${player.dpr.toLocaleString()}${stringDecorations_1.fillSpaces(maxDRPlength - player.dpr.toLocaleString().length)} | ${stringDecorations_1.fillSpaces(maxTotalDamageLength - player.totalDmg.toLocaleString().length)}${player.totalDmg.toLocaleString()}\``)
                    .join("\n"),
                inline: true,
            },
        ],
        author: {
            name: "Leaderboard • DAMAGE",
        },
        footer: {
            text: `${stats.totalGames} 🎮 • ${stats.totalDamage.toLocaleString()} ⚔️`,
        },
    };
};
exports.leaderboardDamage = leaderboardDamage;
