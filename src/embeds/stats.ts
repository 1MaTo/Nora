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
