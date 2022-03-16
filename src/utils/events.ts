import { Message } from "discord.js";
import EventEmitter from "events";
import { resetCommandHubState } from "../api/lobbyWatcher/resetCommandHubState";
import { updateStatusInfo } from "./botStatus";

export const botEvents = new EventEmitter();

botEvents.on(botEvent.update, async () => {
  await updateStatusInfo();
});

botEvents.on(
  botEvent.lobbyWatcherConfigLoaded,
  async (
    message: Message,
    delay: number,
    config?: {
      result: "success" | "error";
      text?: string;
    }
  ) => {
    await resetCommandHubState(message, delay, config);
  }
);
