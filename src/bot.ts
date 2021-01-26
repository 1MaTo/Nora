import { Client, WSEventType } from "discord.js";
import path from "path";
import { GatewayServer, SlashCreator } from "slash-create";
import { appId, publicKey, token } from "./auth.json";
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

creator
  .withServer(
    new GatewayServer((handler) =>
      client.ws.on("INTERACTION_CREATE" as WSEventType, handler)
    )
  )
  .registerCommandsIn(path.join(__dirname, "commands"))
  .syncCommands({
    deleteCommands: true,
    syncGuilds: true,
    skipGuildErrors: true,
  });

client.login(token);
