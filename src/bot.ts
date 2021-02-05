import { Client, WSEventType } from "discord.js";
import path from "path";
import { GatewayServer, SlashCreator } from "slash-create";
import { appId, publicKey, token } from "./auth.json";
import { changeBotStatus, updateStatusInfo } from "./utils/botStatus";
import { production } from "./utils/globals";
import { log } from "./utils/log";
import { restartGamestats, restartLobbyWatcher } from "./utils/restartTimers";
import { sleep } from "./utils/sleep";
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

  if (production) {
    // Restart lobby watchers
    await changeBotStatus("☀ Just woke up");

    sleep(2000);

    const lwCount = await restartLobbyWatcher();
    const gsCount = await restartGamestats();

    // Check for ghost status (available or no)
    setTimeout(() => ghostStatusUpdater(), 5000);
    setTimeout(() => lobbyStatusUpdater(), 10000);
    setTimeout(() => gamesStatusUpdater(1000 * 60 * 5), 15000);

    await updateStatusInfo();
  }

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
