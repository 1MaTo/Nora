import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { getMessageById, sendResponse } from "./discordMessage";
import { getCurrentLobbies } from "./lobbyParser";
import { log } from "./log";

export const lobbyWatcherUpdater = async (guildID: string) => {
  const key = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(key)) as lobbyWatcherInfo;

  // EXIT FROM LOOP, LOBBY WATCHER STOPED
  if (!settings) {
    return;
  }

  const headerMsg = await getMessageById(settings.headerID, settings.channelID);

  // GET FULL INFO FOR LOBBY
  const games = await getCurrentLobbies(guildID);

  // UPDATING HEADER MESSAGE
  try {
    await headerMsg.edit(`edit: ${Date.now()}`);
  } catch (error) {
    // IF FAILED TO UPDATE  HEADER MESSAGE CRATE NEW ONE
    log(error);
    const newHeaderMsg = await sendResponse(
      settings.channelID,
      `just created new header message ${Date.now()}`
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
      const existMsg = settings.lobbysID.find(
        (msg) => msg.botID === game.botid
      );
      if (existMsg) {
        const msg = await getMessageById(
          existMsg.messageID,
          settings.channelID
        );
        try {
          await msg.edit(`im edited ${Date.now()}`);
        } catch (error) {
          log(error);
          // IF FAILED TO UPDATE MESSAGE BUT ITS EXIST SKIP TO NEXT TIME
          if (msg) return;
          // ELSE CREATE NEW ONE
          const newMsg = await sendResponse(
            settings.channelID,
            `My previus message was deleted and now here we go`
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
        const newLobbyMsg = await sendResponse(
          settings.channelID,
          `I'm just a new lobby message`
        );
        if (newLobbyMsg) {
          settings.lobbysID.push({
            botID: game.botid,
            messageID: newLobbyMsg.id,
          });
        }
      }
    })
  );

  await redis.set(key, settings);

  setTimeout(() => lobbyWatcherUpdater(settings.guildID), settings.delay);
};
