import { PartialApplicationCommand } from "slash-create";
import { creator } from "../bot";
import { ghostCommand } from "../commandsObjects/ghost";
import { guildIDs } from "./globals";
import { log } from "./log";

export const updateSlashCommand = async (
  guildID: string,
  command: PartialApplicationCommand
) => {
  try {
    return await creator.api.createCommand(command, guildID);
  } catch (error) {
    log(error);
    return null;
  }
};
