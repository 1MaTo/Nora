import { Client, WSEventType } from "discord.js";
import path from "path";
import { GatewayServer, SlashCreator } from "slash-create";
import { appId, publicKey, token } from "./auth.json";
import { changeBotStatus, updateStatusInfo } from "./utils/botStatus";
import { production } from "./utils/globals";
import { log } from "./utils/log";
import { restartGamestats, restartLobbyWatcher } from "./utils/restartTimers";
import {
  gamesStatusUpdater,
  ghostStatusUpdater,
  lobbyStatusUpdater,
} from "./utils/timerFuncs";

export const client = new Client();

export const creator = new SlashCreator({
  applicationID: appId,
  publicKey: publicKey,
  token: token,
});

client.once("ready", async () => {
  log("------> SETTING UP");

  /* ghostStatusUpdater();
  lobbyStatusUpdater();
  gamesStatusUpdater(1000 * 60 * 10); */

  await changeBotStatus("☀ Just woke up");

  if (production) {
    // Restart lobby watchers
    await changeBotStatus("🔄 Reconnecting to watchers");
    const lwCount = await restartLobbyWatcher();
    await changeBotStatus(`✅ [${lwCount}] Reconnection complete`);

    await changeBotStatus("🔄 Reconnecting to gamestats");
    const gsCount = await restartGamestats();
    await changeBotStatus(`✅ [${gsCount}] Reconnection complete`);

    // Check for ghost status (available or no)
    ghostStatusUpdater();
    lobbyStatusUpdater();
    gamesStatusUpdater(1000 * 60 * 10);
  }

  updateStatusInfo();

  log("------> BOT IN DEVELOPMENT");
});

creator.on("debug", (message) => log("[DEBUG] ----> ", message));
creator.on("warn", (message) => log("[WARNING] ----> ", message));
creator.on("error", (error) => log("[ERROR] ----> ", error));
creator.on("synced", () => log("[COMMAND SYNCED]"));
creator.on("commandRegister", (command) =>
  log(`[REGISTERED COMMAND] ----> ${command.commandName}`)
);
creator.on("commandError", (command, error) =>
  log(`[COMMAND ERROR] [${command.commandName}] ----> `, error)
);

creator
  .withServer(
    new GatewayServer((handler) =>
      client.ws.on("INTERACTION_CREATE" as WSEventType, handler)
    )
  )
  .registerCommandsIn(path.join(__dirname, "commands"))
  .syncCommands();

client.login(token);
