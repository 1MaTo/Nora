import { Client, WSEventType } from "discord.js";
import { GatewayServer, SlashCreator } from "slash-create";
import { token, appId, publicKey } from "./auth.json";
import { log } from "./utils/log";
import path from "path";

export const client = new Client();

const creator = new SlashCreator({
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
  .registerCommandsIn(path.join(__dirname, "commands"));

client.login(token);
