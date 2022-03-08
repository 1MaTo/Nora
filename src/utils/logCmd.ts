import { bold, inlineCode, time } from "@discordjs/builders";
import {
  CacheType,
  CommandInteraction,
  CommandInteractionOption,
} from "discord.js";
import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";
import { commandLogsMaxCount } from "./globals";
import { log } from "./log";

const getOptionsNames = (
  options: readonly CommandInteractionOption<CacheType>[]
): string[] => {
  return options.reduce((prev: string[], option) => {
    if (option.options) {
      return [...prev, option.name, ...getOptionsNames(option.options)];
    }

    return [...prev, option.name];
  }, [] as string[]);
};

export const logCommand = async (
  interaction: CommandInteraction<CacheType>
) => {
  try {
    if (interaction.commandName === "logs") return;

    const key = redisKey.struct(groupsKey.commandLog, [interaction.guildId]);

    const logs = (await redis.get(key)) || [];

    if (logs.length > commandLogsMaxCount) {
      logs.shift();
    }

    const log = `${time(new Date())} ${bold(
      interaction.user.tag
    )}\n${inlineCode(
      [
        interaction.commandName,
        ...getOptionsNames(interaction.options.data),
      ].join(" -> ")
    )}`;

    await redis.set(key, [...logs, log]);
  } catch (err) {
    log("[logCmd] error when logging", err);
  }
};
