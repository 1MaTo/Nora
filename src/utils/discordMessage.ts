import {
  CacheType,
  CommandInteraction,
  InteractionReplyOptions,
  Message,
  MessageEditOptions,
  MessagePayload,
  Snowflake,
} from "discord.js";
import { getTextChannel } from "./discordChannel";
import { msgDeleteTimeout, msgEditTimeout } from "./globals";
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

export const sendReply = async (
  interaction: CommandInteraction<CacheType>,
  content: InteractionReplyOptions,
  delay?: number
) => {
  const message = await interaction.reply(content);
  delay &&
    setTimeout(async () => {
      try {
        await interaction.deleteReply();
      } catch (err) {
        log("[editReply] cant send message");
      }
    }, delay);
  return message;
};

export const editReply = async (
  interaction: CommandInteraction<CacheType>,
  content: InteractionReplyOptions,
  delay?: number
) => {
  const message = await interaction.editReply(content);
  delay &&
    setTimeout(async () => {
      try {
        await interaction.deleteReply();
      } catch (err) {
        log("[editReply] cant delete message");
      }
    }, delay);
  return message;
};

export const deleteMessageWithDelay = async (
  message: Message,
  delay: number = msgDeleteTimeout.short
) => {
  setTimeout(async () => {
    try {
      await message.delete();
    } catch (error) {
      log("[deleting message] cant delete message");
    }
  }, delay);
};

export const editMessageWithDelay = async (
  message: Message,
  content: string | MessagePayload | MessageEditOptions,
  delay: number = msgEditTimeout.short
) => {
  setTimeout(async () => {
    try {
      await message.edit(content);
    } catch (error) {
      log("[editing message] cant edit message");
    }
  }, delay);
};
