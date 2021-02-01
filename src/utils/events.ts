import EventEmitter from "events";
import { updateStatusInfo } from "./botStatus";

export const botStatusInfo = new EventEmitter();

botStatusInfo.on(botEvent.update, async () => {
  updateStatusInfo();
});
