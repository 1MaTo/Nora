import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";

import { parseError } from "../shared/error/parse-error.ts";

export const replyWithError = (interaction: ChatInputCommandInteraction, error: unknown) => {
  const { title, message } = parseError(error);
  const content = `[${title}] ${message}`;
  if (interaction.replied || interaction.deferred) {
    return interaction.followUp({
      content: content,
      flags: MessageFlags.Ephemeral,
    });
  } else {
    return interaction.reply({
      content: content,
      flags: MessageFlags.Ephemeral,
    });
  }
};
