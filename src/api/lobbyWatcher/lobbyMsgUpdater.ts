import { MessageActionRow, MessageButton } from "discord.js";
import md5 from "md5";
import { startGameButtonDefault } from "../../components/buttons/startGame";
import { unhostGameButtonDefault } from "../../components/buttons/unhostGame";
import { lobbyGame } from "../../embeds/lobby";
import { groupsKey, redisKey } from "../../redis/kies";
import { redis } from "../../redis/redis";
import {
  deleteMessageWithDelay,
  editMessage,
  getMessageById,
  sendResponse,
} from "../../utils/discordMessage";
import { buttonId } from "../../utils/globals";
import { getCurrentLobby, playersLobbyToString } from "../../utils/lobbyParser";
import { log } from "../../utils/log";
import { searchMapConfigByMapName } from "../../utils/mapConfig";

export const lobbyMsgUpdater = async (
  guildID: string,
  botid: number,
  delay: number
) => {
  const settingsKey = redisKey.struct(groupsKey.lobbyWatcher, [guildID]);
  const settings = (await redis.get(settingsKey)) as lobbyWatcherInfo;

  if (settings === undefined) {
    log("[lobby msg updater] redis error");
    setTimeout(() => lobbyMsgUpdater(guildID, botid, delay), delay);
    return;
  }

  if (settings === null) {
    log("[lobby msg updater] deleted");
    return;
  }

  if (settings.paused) {
    log("[lobby msg updater] stopped");
    setTimeout(() => lobbyMsgUpdater(guildID, botid, delay), delay);
    return;
  }

  const lobbySettingsKey = redisKey.struct(groupsKey.lobbyGameWatcher, [
    guildID,
    settings.channelID,
    botid.toString(),
  ]);

  const lobbySettings = (await redis.get(
    lobbySettingsKey
  )) as lobbyGameWatcherInfo;

  if (lobbySettings === undefined) {
    log("[lobby msg updater] redis error");
    setTimeout(() => lobbyMsgUpdater(guildID, botid, delay), delay);
    return;
  }

  if (lobbySettings === null) {
    log("[lobby msg updater] deleted");
    return;
  }

  const msg = await getMessageById(lobbySettings.msgId, settings.channelID);

  const game = await getCurrentLobby(guildID, botid);

  if (game === undefined) {
    log("[lobby msg updater] error getting game");
    setTimeout(() => lobbyMsgUpdater(guildID, botid, delay), delay);
    return;
  }

  if (game === null) {
    log("[lobby msg updater] game does not exist, deleting msg");
    const result = await redis.del(lobbySettingsKey);

    if (result === undefined) {
      log("[lobby msg updater] cant delete redis data");
      setTimeout(() => lobbyMsgUpdater(guildID, botid, delay), delay);
      return;
    }

    deleteMessageWithDelay(msg, 0);
    return;
  }

  const { parsedGame, newLobbyHash, prevLobbyHash } = await getGameParams(
    guildID,
    game,
    lobbySettings
  );

  const msgEmbeds = [lobbyGame(parsedGame) as any];

  if (!msg) {
    log("[lobby msg updater] cant get prev msg, creating new one");

    const msgComponents = [
      new MessageActionRow().addComponents(
        startGameButtonDefault({ disabled: game.slotsTaken === 0 }),
        unhostGameButtonDefault()
      ),
    ];

    const newMsg = await sendResponse(settings.channelID, {
      embeds: msgEmbeds,
      components: msgComponents,
    });

    await redis.set(lobbySettingsKey, {
      ...lobbySettings,
      msgId: newMsg.id,
      lobbyHash: newLobbyHash,
    } as lobbyGameWatcherInfo);

    setTimeout(() => lobbyMsgUpdater(guildID, botid, delay), delay);
    return;
  }

  const infoChanged = prevLobbyHash !== newLobbyHash;

  if (!infoChanged) {
    setTimeout(() => lobbyMsgUpdater(guildID, botid, delay), delay);
    return;
  }

  log("[lobby msg updater] updating msg");

  await redis.set(lobbySettingsKey, {
    ...lobbySettings,
    lobbyHash: newLobbyHash,
  } as lobbyGameWatcherInfo);

  const startButton =
    msg.resolveComponent(buttonId.startGame) ||
    (startGameButtonDefault() as MessageButton);
  const unhostButton =
    msg.resolveComponent(buttonId.unhostGame) ||
    (unhostGameButtonDefault() as MessageButton);

  await editMessage(msg, {
    embeds: msgEmbeds,
    components: [
      new MessageActionRow().addComponents(
        startButton.setDisabled(game.slotsTaken === 0),
        unhostButton
      ),
    ],
  });

  setTimeout(() => lobbyMsgUpdater(guildID, botid, delay), delay);
  return;
};

const getGameParams = async (
  guildID: string,
  game: lobbyInfo<lobbyTable[]>,
  lobbySettings: lobbyGameWatcherInfo
) => {
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

  const prevLobbyHash = lobbySettings.lobbyHash;
  const newLobbyHash = md5(
    parsedPlayers.nicks + JSON.stringify(parsedPlayers.option) + game.mapname
  );

  return { prevLobbyHash, newLobbyHash, parsedGame };
};
