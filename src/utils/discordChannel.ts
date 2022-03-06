import { Snowflake, TextChannel } from "discord.js";
import { client } from "../bot";
import { log } from "./log";

export const getTextChannel = async (
  id: Snowflake
): Promise<TextChannel | null> => {
  try {
    const channel = await client.channels.fetch(id, { force: true });
    if (!channel.isText()) return null;
    return channel as TextChannel;
  } catch (error) {
    log(error);

    return null;
  }
};
