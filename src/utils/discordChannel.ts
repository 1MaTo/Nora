import { Snowflake } from "discord.js";
import { client } from "../bot";
import { log } from "./log";

export const getChannel = async (id: Snowflake) => {
  try {
    const channel = await client.channels.fetch(id, true);

    return channel;
  } catch (error) {
    log(error);

    return null;
  }
};
