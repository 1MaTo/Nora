import { Snowflake, TextChannel } from "discord.js";
import { client } from "../bot";
import { getChannel } from "./discordChannel";
import { log } from "./log";

export const sendResponse = async (
  id: Snowflake,
  content: any,
  deleteTimeOut: null | number = null
) => {
  try {
    const channel = (await getChannel(id)) as TextChannel;
    const message = await channel.send(content);
    if (deleteTimeOut) message.delete({ timeout: deleteTimeOut });

    return message;
  } catch (error) {
    log(error);

    return null;
  }
};
