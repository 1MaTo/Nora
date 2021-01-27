import { CommandContext, SlashCommand } from "slash-create";
import { ghostCommand } from "../commandsObjects/ghost";
import { error, loading, success, warning } from "../embeds/response";
import { sendResponse } from "../utils/discordMessage";
import { ghostCmd, guildIDs, ownerID, production } from "../utils/globals";
import { log } from "../utils/log";
import {
  checkLogsForKeyWords,
  getChatRows,
  sendCommand,
} from "../utils/requestToGuiServer";

export default class ghost extends SlashCommand {
  constructor(creator: any) {
    super(creator, ghostCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async onError(error: Error, ctx: CommandContext) {
    log(error.message);
    return false;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;
    //log(ctx.options);

    if (ctx.options.pub) {
      const message = await sendResponse(ctx.channelID, { embed: loading() });
      const result = await pubGame(ctx.options.pub["gamename"]);

      if (result) {
        message.edit({ embed: success(`Game ${result} hosted`) });
      } else if (result === false) {
        message.edit({
          embed: warning(`Can't host, another lobby already exists`),
        });
      } else {
        message.edit({ embed: error(`Network error`) });
      }
      message.delete({ timeout: ghostCmd.deleteMessageTimeout });
      return;
    }

    if (ctx.options.unhost) {
      const message = await sendResponse(ctx.channelID, { embed: loading() });
      const result = await unhostGame();

      if (result) {
        message.edit({ embed: success(`Game ${result} unhosted`) });
      } else if (result === false) {
        message.edit({
          embed: warning(`Nothing to unhost`),
        });
      } else {
        message.edit({ embed: error(`Network error`) });
      }
      message.delete({ timeout: ghostCmd.deleteMessageTimeout });
      return;
    }

    if (ctx.options.start) {
      const message = await sendResponse(ctx.channelID, {
        embed: loading("Starting game..."),
      });
      const result = await startGame(ctx.options.start["force"]);

      if (result) {
        message.edit({ embed: success(`Game ${result} started`) });
      } else if (result === false) {
        message.edit({
          embed: warning(`Nothing to start or users are not pinged`),
        });
      } else {
        message.edit({ embed: error(`Network error`) });
      }

      message.delete({ timeout: ghostCmd.deleteMessageTimeout });
      return;
    }

    if (ctx.options.load) {
      const message = await sendResponse(ctx.channelID, {
        embed: loading("Load map config..."),
      });
      const result = await loadMapCfg(ctx.options.load["map"]);

      if (result) {
        message.edit({ embed: success(`Map ${result} loaded`) });
      } else if (result === false) {
        message.edit({
          embed: warning(`No maps found for this pattern`),
        });
      } else {
        message.edit({ embed: error(`Network error`) });
      }

      message.delete({ timeout: ghostCmd.deleteMessageTimeout });
      return;
    }

    if (ctx.options.map) {
      const message = await sendResponse(ctx.channelID, {
        embed: loading("Load map config..."),
      });
      const result = await loadMap(ctx.options.map["name"]);

      if (result) {
        message.edit({ embed: success(`Map ${result} loaded`) });
      } else if (result === false) {
        message.edit({
          embed: warning(`No maps found for this pattern`),
        });
      } else {
        message.edit({ embed: error(`Network error`) });
      }

      message.delete({ timeout: ghostCmd.deleteMessageTimeout });
      return;
    }
  }
}

const pubGame = async (gamename: string | undefined) => {
  const rows = await getChatRows();
  const commandSent = await sendCommand(`pub ${gamename ? gamename : ""}`);
  if (!commandSent) return null;
  const result = await checkLogsForKeyWords(
    /creating game \[.*\]/,
    rows,
    ghostCmd.requestInterval,
    ghostCmd.pendingTimeout
  );
  if (result) {
    return result.match(/ \[.*\]/)[0];
  }
  return result;
};

const unhostGame = async () => {
  const rows = await getChatRows();
  const commandSent = await sendCommand("unhost");
  if (!commandSent) return null;
  const result = await checkLogsForKeyWords(
    /deleting current game \[.*\]/,
    rows,
    ghostCmd.requestInterval,
    ghostCmd.pendingTimeout
  );
  if (result) {
    return result.match(/ \[.*\]/)[0];
  }
  return result;
};

const startGame = async (force: boolean) => {
  const rows = await getChatRows();
  const commandSent = await sendCommand(`start ${force ? "force" : ""}`);
  if (!commandSent) return null;
  const result = await checkLogsForKeyWords(
    /GAME:.*started loading with \d+ players/,
    rows,
    1000,
    ghostCmd.pendingTimeout + 4
  );
  if (result) {
    return result.match(/GAME: .*\]/)[0].replace("GAME: ", "[");
  }

  return result;
};

const loadMapCfg = async (map: string) => {
  const rows = await getChatRows();
  const commandSend = sendCommand(`load ${map ? map : ""}`);
  if (!commandSend) return null;
  const result = await checkLogsForKeyWords(
    /CONFIG] loading file/,
    rows,
    1000,
    3000
  );
  if (result) {
    return result.match(/[^/]+$/)[0].slice(0, -5);
  }
  return result;
};

const loadMap = async (map: string) => {
  const rows = await getChatRows();
  const commandSend = sendCommand(`map ${map ? map : ""}`);
  if (!commandSend) return null;
  const result = await checkLogsForKeyWords(
    /MAP] loading MPQ file/,
    rows,
    1000,
    3000
  );
  if (result) {
    return result.match(/[^\\]+$/)[0].slice(0, -5);
  }
  return result;
};
