import { Snowflake, TextChannel } from "discord.js";
import { client } from "../bot";
import { getTextChannel } from "./discordChannel";
import { log } from "./log";

export const sendResponse = async (
  channelID: Snowflake,
  content: any,
  deleteTimeOut: null | number = null
) => {
  try {
    const channel = await getTextChannel(channelID);
    const message = await channel.send(content);
    if (deleteTimeOut) setTimeout(() => message.delete(), deleteTimeOut);

    return message;
  } catch (error) {
    log(error);
    return null;
  }
};

export const getMessageById = async (
  messageID: Snowflake,
  channelID: Snowflake
) => {
  try {
    const channel = await getTextChannel(channelID);
    const message = await channel.messages.fetch(messageID, { force: true });
    return message;
  } catch (error) {
    log(error);
    return null;
  }
};
