import { Client, WSEventType } from "discord.js";
import path from "path";
import { GatewayServer, SlashCreator } from "slash-create";
import { appId, publicKey, token } from "./auth.json";
import { guildIDs, production } from "./utils/globals";
import { log } from "./utils/log";

export const client = new Client();

export const creator = new SlashCreator({
  applicationID: appId,
  publicKey: publicKey,
  token: token,
});

client.once("ready", async () => {
  log("------> SETTING UP");

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
