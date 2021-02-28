import { getWinrateColor } from "../utils/colorParsers";
import { log } from "../utils/log";

export const totalGamesForNickname = (
  nickname: string,
  games: gamesCountGroupedInfo
) => {
  return {
    description: `${games.groupedGames
      .map((group) => {
        if (group.versions.length === 1)
          return `:map: [**${group.totalGames}**] __${group.versions[0].mapVersion}__`;
        return `:map: [**${group.totalGames}**] __${group.map}__\n
            ${group.versions
              .map(
                (version) =>
                  `> :small_blue_diamond: [**${version.gamesCount}**] ${version.mapVersion}`
              )
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

export const playerWinrate = ({
  stats,
  playersType,
  sortFunc,
  sortDescription,
  page,
  maxPage,
  itemsOnPage,
}: {
  stats: playerWinStats;
  playersType: "teammates" | "enemies" | string;
  sortFunc: (a: any, b: any) => number;
  sortDescription: "winrate" | "games" | string;
  page: number;
  maxPage: number;
  itemsOnPage: number;
}) => {
  return {
    title: `${stats.player.nickname} 🔸 ${stats.player.percent}% 🔸 [ <:winstreak:812779155334365184> ${stats.player.win} | <:losestreak:812779155418644521> ${stats.player.lose} ]`,
    description: `${
      playersType === "teammates"
        ? "🤝 __Teammates ranking__ 🤝"
        : "😈 __Enemies ranking__ 😈"
    }
      
          Most ${sortDescription} ${
      playersType === "teammates" ? "with you in team" : "against you"
    }

          ${[...stats[playersType]]
            .sort(sortFunc)
            .splice((page - 1) * itemsOnPage, itemsOnPage)
            .map(
              ({ nickname, win, lose, percent }) =>
                `\`${nickname}\` 🔸 **${percent}%** 🔸 [ <:winstreak:812779155334365184>  **${win}** |<:losestreak:812779155418644521>**  ${lose}** ]`
            )
            .join("\n\n")} `,
    color: getWinrateColor(stats.player.percent),
    author: {
      name: "📝FBT winrate stats 📝",
    },
    footer: {
      text: `${stats.player.win + stats.player.lose} games ● ${
        stats[playersType].length
      } ${playersType} ● page ${page}/${maxPage}`,
    },
  };
};
