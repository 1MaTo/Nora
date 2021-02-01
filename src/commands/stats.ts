import { CommandContext, SlashCommand } from "slash-create";
import { statsCommand } from "../commandsObjects/stats";
import { getGamesCountInfo } from "../db/queries";
import { warning } from "../embeds/response";
import { totalGamesForNickname } from "../embeds/stats";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { sendResponse } from "../utils/discordMessage";
import { msgDeleteTimeout, ownerID, production } from "../utils/globals";
import { searchMapConfigByMapName } from "../utils/mapConfig";
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
      const bindedNick = await redis.get(key);
      const nickName = ctx.options.totalgames["nickname"] || bindedNick;

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
