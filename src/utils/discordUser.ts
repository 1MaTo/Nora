import { Snowflake } from "discord.js";
import { getGuild } from "./discordGuild";
import { log } from "./log";

export const getMember = async (guildID: Snowflake, userID: Snowflake) => {
  try {
    const guild = await getGuild(guildID);
    const user = guild.member(userID);

    return user;
  } catch (error) {
    log(error);

    return null;
  }
};
