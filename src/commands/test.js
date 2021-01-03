import { dbErrors } from "../strings/logsMessages";
import { fbtSettings } from "../../config.json";
import { logError, autodeleteMsg } from "../utils";

export const name = "test";
export const args = 0;
export const aliases = ["t", "te"];
export const usage = "<one> <two>";
export const description = "Just test command";
export const guildOnly = true;
export const development = true;
export const adminOnly = false;
export const caseSensitive = true;
export const run = (message, args) => {
    console.log(args[0]);
    message.channel.send("hi");
};
