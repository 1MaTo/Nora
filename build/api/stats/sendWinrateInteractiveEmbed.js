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
exports.sendWinrateInteractiveEmbed = void 0;
const stats_1 = require("../../embeds/stats");
const discordMessage_1 = require("../../utils/discordMessage");
const log_1 = require("../../utils/log");
const sendWinrateInteractiveEmbed = (interaction, stats, userAvatar) => __awaiter(void 0, void 0, void 0, function* () {
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
    const embed = (yield (0, discordMessage_1.editReply)(interaction, {
        embeds: [(0, stats_1.playerWinrate)(embedSettings)],
    }));
    Object.values(emojiCommand).map((emoji) => embed.react(emoji));
    const userFilter = (_, user) => {
        return user.id === interaction.user.id;
    };
    const collector = embed.createReactionCollector({
        filter: userFilter,
        time: 120000,
    });
    collector.on("collect", (reaction) => {
        try {
            reaction.users.remove(interaction.user.id);
        }
        catch (err) {
            (0, log_1.log)("[winrate] cant delete reaction");
        }
        switch (reaction.emoji.name) {
            case emojiCommand.prevPage:
                if (embedSettings.page === 1)
                    return;
                embedSettings.page--;
                interaction.editReply({
                    embeds: [(0, stats_1.playerWinrate)(embedSettings)],
                });
                return;
            case emojiCommand.nextPage:
                if (embedSettings.page === embedSettings.maxPage)
                    return;
                embedSettings.page++;
                interaction.editReply({
                    embeds: [(0, stats_1.playerWinrate)(embedSettings)],
                });
                return;
            case emojiCommand.sortByGames:
                if (embedSettings.sortDescription === "games")
                    return;
                embedSettings.sortDescription = "games";
                embedSettings.sortFunc = sortByGamesCount;
                interaction.editReply({
                    embeds: [(0, stats_1.playerWinrate)(embedSettings)],
                });
                return;
            case emojiCommand.sortByPercent:
                if (embedSettings.sortDescription === "winrate")
                    return;
                embedSettings.sortDescription = "winrate";
                embedSettings.sortFunc = sortByPercent;
                interaction.editReply({
                    embeds: [(0, stats_1.playerWinrate)(embedSettings)],
                });
                return;
            case emojiCommand.switchPlayerType:
                embedSettings.playersType =
                    embedSettings.playersType === "teammates" ? "enemies" : "teammates";
                embedSettings.page = 1;
                embedSettings.maxPage = Math.ceil(stats[embedSettings.playersType].length / itemsOnPage);
                interaction.editReply({
                    embeds: [(0, stats_1.playerWinrate)(embedSettings)],
                });
                return;
            case emojiCommand.closeEmbed:
                collector.stop();
        }
    });
    collector.on("end", (_) => {
        interaction.deleteReply();
    });
});
exports.sendWinrateInteractiveEmbed = sendWinrateInteractiveEmbed;
const sortByGamesCount = (a, b) => b.win + b.lose - (a.win + a.lose);
const sortByPercent = (a, b) => b.percent - a.percent;
