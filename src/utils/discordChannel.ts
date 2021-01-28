import { Snowflake, TextChannel } from "discord.js";
import { client } from "../bot";
import { log } from "./log";

export const getTextChannel = async (
  id: Snowflake
): Promise<TextChannel | null> => {
  try {
    const channel = await client.channels.fetch(id, true);
    if (channel.type !== "text") return null;
    return channel as TextChannel;
  } catch (error) {
    log(error);

    return null;
  }
};
