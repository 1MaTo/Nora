import { getFinishedGamesId, getLobbyList } from "../db/queries";
import { header, lobbyGame } from "../embeds/lobby";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { changeBotStatus } from "./botStatus";
import { getMessageById, sendResponse } from "./discordMessage";
import { botStatusInfo } from "./events";
import { collectGamesData } from "./gamestatsUtils";
import { botStatusVariables } from "./globals";
import { getCurrentLobbies, playersLobbyToString } from "./lobbyParser";
import { log } from "./log";
import { searchMapConfigByMapName } from "./mapConfig";
import { reloadBot } from "./reloadBot";
import { report } from "./reportToOwner";
import {
  checkLogsForKeyWords,
  getChatRows,
  sendCommand,
} from "./requestToGuiServer";
import { getPassedTime } from "./timePassed";

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

    // UPDATING HEADER MESSAGE
    try {
      await headerMsg.edit({
        embed: header(
          games.length,
          getPassedTime(settings.startTime, Date.now())
        ),
      });
    } catch (error) {
      // IF FAILED TO UPDATE  HEADER MESSAGE CRATE NEW ONE
      log(error);
      const newHeaderMsg = await sendResponse(settings.channelID, {
        embed: header(
          games.length,
          getPassedTime(settings.startTime, Date.now())
        ),
      });
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
          try {
            await msg.edit({
              embed: lobbyGame(
                parsedGame,
                getPassedTime(existMsg.startTime, Date.now())
              ),
            });
          } catch (error) {
            log(error);
            // IF FAILED TO UPDATE MESSAGE BUT ITS EXIST SKIP TO NEXT TIME
            if (msg) return;
            // ELSE CREATE NEW ONE
            const newMsg = await sendResponse(settings.channelID, {
              embed: lobbyGame(
                parsedGame,
                getPassedTime(existMsg.startTime, Date.now())
              ),
            });
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
            embed: lobbyGame(parsedGame, getPassedTime(startTime, Date.now())),
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
    //await changeBotStatus("🔄 Crashed 😱, reboot 🔄");
    //reloadBot(false);
  }
};

export const gamestatsUpdater = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.gameStats, [guildID]);
  const settings = (await redis.get(key)) as gamestatsInfo;

  if (!settings) return;

  const ids = await getFinishedGamesId();

  if (!ids)
    setTimeout(() => gamestatsUpdater(settings.guildID), settings.delay);

  if (!settings.prevGamesCount) {
    settings.prevGamesCount = ids.length;
    await redis.set(key, settings);
  }

  const newGamesCount = ids.length - settings.prevGamesCount;

  if (newGamesCount) {
    settings.prevGamesCount = ids.length;
    await redis.set(key, settings);
    const idToPoll = ids.splice(-newGamesCount);
    collectGamesData(idToPoll, settings.channelID, settings.guildID),
  }
  setTimeout(() => gamestatsUpdater(settings.guildID), settings.delay);
};

export const ghostStatusUpdater = async () => {
  const rows = await getChatRows();
  const changedState = botStatusVariables.ghost !== Boolean(rows);
  if (changedState) {
    botStatusVariables.ghost = Boolean(rows);
    botStatusInfo.emit(botEvent.update);
  }
  setTimeout(() => ghostStatusUpdater(), 5000);
};

export const lobbyStatusUpdater = async () => {
  const games = (await getLobbyList()).filter(
    (game) =>
      !(
        game.gamename === "" &&
        game.ownername === "" &&
        game.creatorname === ""
      )
  );

  const changedState = botStatusVariables.lobbyCount !== games.length;

  if (changedState) {
    botStatusVariables.lobbyCount = games.length;
    botStatusInfo.emit(botEvent.update);
  }
  setTimeout(() => lobbyStatusUpdater(), 5000);
};

export const gamesStatusUpdater = async (delay: number) => {
  const rows = await getChatRows();
  const sent = await sendCommand("ggs");

  if (!sent) return setTimeout(() => gamesStatusUpdater(delay), delay);

  const result = await checkLogsForKeyWords(
    /\(\d+ today+\).*/g,
    rows,
    500,
    5000
  );

  if (!result) return setTimeout(() => gamesStatusUpdater(delay), delay);

  const gameCount = (result as string).match(/\#\d+:/g);

  if (!gameCount) {
    botStatusVariables.gameCount = 0;
    botStatusInfo.emit(botEvent.update);
    return setTimeout(() => gamesStatusUpdater(delay), delay);
  }

  const changedState = botStatusVariables.gameCount !== gameCount.length;

  if (changedState) {
    botStatusVariables.gameCount = gameCount.length;
    botStatusInfo.emit(botEvent.update);
  }

  setTimeout(() => gamesStatusUpdater(delay), delay);
};
