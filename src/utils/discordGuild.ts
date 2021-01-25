import { Snowflake } from "discord.js";
import { client } from "../bot";
import { log } from "./log";

export const getGuild = async (guildID: Snowflake) => {
  try {
    const guild = await client.guilds.fetch(guildID, true);

    return guild;
  } catch (error) {
    log(error);

    return null;
  }
};
