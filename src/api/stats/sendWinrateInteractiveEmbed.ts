import { CommandInteraction, Message, MessageReaction, User } from "discord.js";
import { playerWinrate } from "../../embeds/stats";
import { editReply } from "../../utils/discordMessage";
import { log } from "../../utils/log";

export const sendWinrateInteractiveEmbed = async (
  interaction: CommandInteraction,
  stats: playerWinStats,
  userAvatar: string
) => {
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

  const embed = (await editReply(interaction, {
    embeds: [playerWinrate(embedSettings) as any],
  })) as Message;

  Object.values(emojiCommand).map((emoji) => embed.react(emoji));

  const userFilter = (_: MessageReaction, user: User) => {
    return user.id === interaction.user.id;
  };

  const collector = embed.createReactionCollector({
    filter: userFilter,
    time: 120000,
  });

  collector.on("collect", (reaction) => {
    try {
      reaction.users.remove(interaction.user.id);
    } catch (err) {
      log("[winrate] cant delete reaction");
    }
    switch (reaction.emoji.name) {
      case emojiCommand.prevPage:
        if (embedSettings.page === 1) return;
        embedSettings.page--;
        interaction.editReply({
          embeds: [playerWinrate(embedSettings) as any],
        });
        return;

      case emojiCommand.nextPage:
        if (embedSettings.page === embedSettings.maxPage) return;
        embedSettings.page++;
        interaction.editReply({
          embeds: [playerWinrate(embedSettings) as any],
        });
        return;

      case emojiCommand.sortByGames:
        if (embedSettings.sortDescription === "games") return;
        embedSettings.sortDescription = "games";
        embedSettings.sortFunc = sortByGamesCount;
        interaction.editReply({
          embeds: [playerWinrate(embedSettings) as any],
        });
        return;

      case emojiCommand.sortByPercent:
        if (embedSettings.sortDescription === "winrate") return;
        embedSettings.sortDescription = "winrate";
        embedSettings.sortFunc = sortByPercent;
        interaction.editReply({
          embeds: [playerWinrate(embedSettings) as any],
        });
        return;

      case emojiCommand.switchPlayerType:
        embedSettings.playersType =
          embedSettings.playersType === "teammates" ? "enemies" : "teammates";
        embedSettings.page = 1;
        embedSettings.maxPage = Math.ceil(
          stats[embedSettings.playersType].length / itemsOnPage
        );
        interaction.editReply({
          embeds: [playerWinrate(embedSettings) as any],
        });
        return;

      case emojiCommand.closeEmbed:
        collector.stop();
    }
  });

  collector.on("end", (_) => {
    interaction.deleteReply();
  });
};

const sortByGamesCount = (a: any, b: any) => b.win + b.lose - (a.win + a.lose);
const sortByPercent = (a: any, b: any) => b.percent - a.percent;
