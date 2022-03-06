import { MessageReaction, User } from "discord.js";
import { CommandContext, SlashCommand } from "slash-create";
import { statsCommand } from "../commandsObjects/stats";
import { getGamesCountInfo } from "../db/queries";
import { warning } from "../embeds/response";
import {
  leaderboardDamage,
  playerWinrate,
  totalGamesForNickname,
} from "../embeds/stats";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { sendResponse } from "../utils/discordMessage";
import { msgDeleteTimeout, ownerID, production } from "../utils/globals";
import { log } from "../utils/log";
import { searchMapConfigByMapName } from "../utils/mapConfig";
import {
  getLeaderBordByDamage,
  getParsedGamesStats,
  getWinStats,
} from "../utils/MMDstats";
import { getDiscordUsersFromNicknames } from "../utils/nicknameToDiscordUser";
import { uniqueFromArray } from "../utils/uniqueFromArray";

export default class stats extends SlashCommand {
  constructor(creator: any) {
    super(creator, statsCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;

    if (ctx.options.totalgames) {
      const key = redisKey.struct(groupsKey.bindNickname, [
        ctx.guildID,
        ctx.member.id,
      ]);
      const user = (await redis.get(key)) as userData;
      const nickName =
        ctx.options.totalgames["nickname"] || (user && user.nickname);

      if (!nickName) {
        await sendResponse(
          ctx.channelID,
          { embed: warning("No nickname") },
          msgDeleteTimeout.default
        );
        return;
      }

      const games = await getTotalGamesStats(ctx.guildID, nickName);

      if (!games) {
        await sendResponse(
          ctx.channelID,
          { embed: warning(`No games for ${nickName}`) },
          msgDeleteTimeout.long
        );
        return;
      }

      const groupedGamesData = getGroupedGamesWithConfig(games);
      await sendResponse(
        ctx.channelID,
        {
          embed: totalGamesForNickname(nickName, groupedGamesData),
        },
        msgDeleteTimeout.long
      );
      return;
    }

    if (ctx.options.winrate) {
      const key = redisKey.struct(groupsKey.bindNickname, [
        ctx.guildID,
        ctx.member.id,
      ]);
      const user = (await redis.get(key)) as userData;
      const nickname =
        ctx.options.winrate["nickname"] || (user && user.nickname);

      if (!nickname) {
        await sendResponse(
          ctx.channelID,
          { embed: warning("No nickname") },
          msgDeleteTimeout.default
        );
        return;
      }

      const stats = await getWinStats(nickname);

      if (!stats) {
        await sendResponse(
          ctx.channelID,
          {
            embed: warning("No games for this nicknames"),
          },
          msgDeleteTimeout.default
        );
      }

      const member = await getDiscordUsersFromNicknames(
        [nickname],
        ctx.guildID
      );

      sendWinrateInteractiveEmbed(
        ctx.channelID,
        ctx.member.id,
        stats,
        member[0] &&
          member[0].user.avatarURL({ format: "png", dynamic: true, size: 512 })
      );
      return;
    }

    if (ctx.options.damage) {
      const damageStats = await getLeaderBordByDamage();

      if (!damageStats) {
        await sendResponse(
          ctx.channelID,
          { embed: warning("No players for stats") },
          msgDeleteTimeout.default
        );
        return;
      }

      await sendResponse(
        ctx.channelID,
        { embed: leaderboardDamage(damageStats) },
        msgDeleteTimeout.info
      );
    }

    return;
  }
}

const getTotalGamesStats = async (
  guildID: string,
  nickname: string
): Promise<Array<gamesCountInfo> | null> => {
  const games = await getGamesCountInfo(nickname);
  if (!games) return null;

  const filterSpectators = await Promise.all(
    games.map(async (game) => {
      const config = await searchMapConfigByMapName(game.map, guildID);

      if (!config) return game;

      const spectatorTeam = config.slotMap.findIndex(
        (team) => team.name.toLowerCase() === "spectators"
      );

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
    })
  );

  const actualGames = filterSpectators.filter(
    (game) => game !== null
  ) as Array<gamesCountInfo>;

  if (!actualGames.length) return null;

  return actualGames;
};

const getGroupedGamesWithConfig = (games: Array<gamesCountInfo>) => {
  const maps = uniqueFromArray(games.map((game) => game.map));

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
    totalGamesCount: groupedGames.reduce(
      (count: number, group: any) => count + group.totalGames,
      0
    ),
    groupedGames,
  };
};

const sendWinrateInteractiveEmbed = async (
  channelID: string,
  userID: string,
  stats: playerWinStats,
  userAvatar?: string
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

  const embed = await sendResponse(channelID, {
    embed: playerWinrate(embedSettings),
  });

  Object.values(emojiCommand).map((emoji) => embed.react(emoji));

  const userFilter = (reaction: MessageReaction, user: User) =>
    user.id === userID;
  const collector = embed.createReactionCollector({
    filter: userFilter,
    time: 120000,
  });

  collector.on("collect", (reaction) => {
    reaction.users.remove(userID);
    switch (reaction.emoji.name) {
      case emojiCommand.prevPage:
        if (embedSettings.page === 1) return;
        embedSettings.page--;
        embed.edit({ embeds: [playerWinrate(embedSettings) as any] });
        return;

      case emojiCommand.nextPage:
        if (embedSettings.page === embedSettings.maxPage) return;
        embedSettings.page++;
        embed.edit({ embeds: [playerWinrate(embedSettings) as any] });
        return;

      case emojiCommand.sortByGames:
        if (embedSettings.sortDescription === "games") return;
        embedSettings.sortDescription = "games";
        embedSettings.sortFunc = sortByGamesCount;
        embed.edit({ embeds: [playerWinrate(embedSettings) as any] });
        return;

      case emojiCommand.sortByPercent:
        if (embedSettings.sortDescription === "winrate") return;
        embedSettings.sortDescription = "winrate";
        embedSettings.sortFunc = sortByPercent;
        embed.edit({ embeds: [playerWinrate(embedSettings) as any] });
        return;

      case emojiCommand.switchPlayerType:
        embedSettings.playersType =
          embedSettings.playersType === "teammates" ? "enemies" : "teammates";
        embedSettings.page = 1;
        embedSettings.maxPage = Math.ceil(
          stats[embedSettings.playersType].length / itemsOnPage
        );
        embed.edit({ embeds: [playerWinrate(embedSettings) as any] });
        return;

      case emojiCommand.closeEmbed:
        embed.delete();
        return;
    }
  });

  collector.on("end", (_) => {
    embed.delete();
  });
};

const sortByGamesCount = (a: any, b: any) => b.win + b.lose - (a.win + a.lose);
const sortByPercent = (a: any, b: any) => b.percent - a.percent;
