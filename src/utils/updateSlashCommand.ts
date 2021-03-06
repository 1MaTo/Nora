import { PartialApplicationCommand } from "slash-create";
import { creator } from "../bot";
import { log } from "./log";

export const updateSlashCommand = async (
  guildID: string | undefined,
  command: PartialApplicationCommand
) => {
  try {
    return await creator.api.createCommand(command, guildID);
  } catch (error) {
    log(error);
    return null;
  }
};
