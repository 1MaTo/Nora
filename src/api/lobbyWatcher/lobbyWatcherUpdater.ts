import { MessageActionRow, MessageButton } from "discord.js";
import {
  hostGameButton,
  successGameButton,
  unhostGameButton,
} from "../../components/buttons/hostGame";
import { clearLobbyGame } from "../../db/queries";
import { header, lobbyGame } from "../../embeds/lobby";
import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import { getMessageById, sendResponse } from "../../utils/discordMessage";
import { buttonId, ghostGuildBotId } from "../../utils/globals";
import {
  getCurrentLobbies,
  playersLobbyToString,
} from "../../utils/lobbyParser";
import { log } from "../../utils/log";
import { searchMapConfigByMapName } from "../../utils/mapConfig";
import { report } from "../../utils/reportToOwner";
import { getPassedTime } from "../../utils/timePassed";

export const lobbyWatcherUpdater = async (guildID: string) => {
  try {
    const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
    const settings = (await redis.get(key)) as lobbyWatcherInfo;

    // EXIT FROM LOOP, LOBBY WATCHER STOPED
    if (!settings) {
      return;
    }

    const headerMsg = await getMessageById(
      settings.headerID,
      settings.channelID
    );

    // GET FULL INFO FOR LOBBY
    const games = await getCurrentLobbies(guildID);

    // IF FAILED TO GET LOBBIES JUST SKIP AND WAIT NEXT TIME
    if (!games) {
      await report(
        `FAILED TO GET LOBBY GAMES, WAIT FOR NEXT TRY AFTER 10 SECONDS`
      );
      setTimeout(() => lobbyWatcherUpdater(settings.guildID), 10000);
      return;
    }

    // UPDATING HEADER MESSAGE;

    const isGameExist = games.some((game) => game.botid === ghostGuildBotId);
    const button = headerMsg.resolveComponent(
      buttonId.hostGame
    ) as MessageButton;

    const headerComponents = new MessageActionRow().addComponents(
      !isGameExist && button && button.label === "Loading..."
        ? button
        : isGameExist
        ? successGameButton
        : hostGameButton
    );

    const headerMsgContent = {
      embeds: [
        header(
          games.length,
          getPassedTime(settings.startTime, Date.now())
        ) as any,
      ],
      components: [headerComponents],
    };

    try {
      await headerMsg.edit(headerMsgContent);
    } catch (error) {
      // IF FAILED TO UPDATE HEADER MESSAGE CRATE NEW ONE
      log(error);
      // IF FAILED TO UPDATE HEADER MESSAGE BUT ITS EXIST SKIP TO NEXT TIME
      if (headerMsg) return;
      // ELSE CREATE NEW ONE
      const newHeaderMsg = await sendResponse(
        settings.channelID,
        headerMsgContent
      );
      settings.headerID = newHeaderMsg.id;
    }

    // DELETE OUTDATED LOBBY MESSAGES
    if (settings.lobbysID) {
      const newLobbysID: lobbyWatcherLobyMessageInfo[] = [];
      await Promise.all(
        settings.lobbysID.map(async (lobbyMsg) => {
          try {
            if (!games.some((game) => game.botid === lobbyMsg.botID)) {
              const msg = await getMessageById(
                lobbyMsg.messageID,
                settings.channelID
              );
              msg && (await msg.delete());
            } else {
              newLobbysID.push(lobbyMsg);
            }
          } catch (error) {
            log(error);
          }
        })
      );
      settings.lobbysID = newLobbysID;
    }

    // UPDATING CURRENT LOBBY MESSAGES
    await Promise.all(
      games.map(async (game) => {
        const config = await searchMapConfigByMapName(game.mapname, guildID);
        const optionField =
          config && config.options.ranking
            ? optionLobbyField.winrate
            : optionLobbyField.server;
        const parsedPlayers = playersLobbyToString(game.players, optionField);
        const parsedGame = {
          ...game,
          players: parsedPlayers,
        } as lobbyInfo<lobbyStrings>;
        const existMsg = settings.lobbysID.find(
          (msg) => msg.botID === game.botid
        );

        if (existMsg) {
          const msg = await getMessageById(
            existMsg.messageID,
            settings.channelID
          );

          const button = msg.resolveComponent(
            buttonId.unhostGame
          ) as MessageButton;

          // IF LOBBY PENDING 5+ HOURS, DELETE THIS LOBBY FROM DB
          if (Date.now() - existMsg.startTime > 1000 * 60 * 60 * 5) {
            clearLobbyGame(game.botid);
          }

          const lobbyMsgContent = {
            embeds: [
              lobbyGame(
                parsedGame,
                getPassedTime(existMsg.startTime, Date.now())
              ),
            ],
            components: [
              new MessageActionRow().addComponents(
                button && button.label === "Loading..."
                  ? button
                  : unhostGameButton
              ),
            ],
          };

          try {
            await msg.edit(lobbyMsgContent);
          } catch (error) {
            log(error);
            // IF FAILED TO UPDATE MESSAGE BUT ITS EXIST SKIP TO NEXT TIME
            if (msg) return;
            // ELSE CREATE NEW ONE
            const newMsg = await sendResponse(
              settings.channelID,
              lobbyMsgContent
            );
            const msgIndex = settings.lobbysID.findIndex(
              (lobbyMsg) => lobbyMsg.botID === existMsg.botID
            );
            if (newMsg) {
              settings.lobbysID[msgIndex].messageID = newMsg.id;
            } else {
              settings.lobbysID.splice(msgIndex, 1);
            }
          }
        } else {
          const startTime = Date.now();
          const newLobbyMsg = await sendResponse(settings.channelID, {
            embeds: [
              lobbyGame(
                parsedGame,
                getPassedTime(startTime, Date.now())
              ) as any,
            ],
            components: [
              new MessageActionRow().addComponents(unhostGameButton),
            ],
          });
          if (newLobbyMsg) {
            settings.lobbysID.push({
              botID: game.botid,
              messageID: newLobbyMsg.id,
              startTime: Date.now(),
            });
          }
        }
      })
    );

    await redis.set(key, settings);

    setTimeout(() => lobbyWatcherUpdater(settings.guildID), settings.delay);
  } catch (err) {
    const error = err as Error;
    await report(
      `${error.name}\n\n${error.message}\n\n${error.stack} FROM LOBBY WATCHER CRASHED`
    );
    log(error);
    setTimeout(() => lobbyWatcherUpdater(guildID), 10000);
  }
};
