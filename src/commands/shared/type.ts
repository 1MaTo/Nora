import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type CommandCall = (interaction: ChatInputCommandInteraction) => Promise<void>;

export type Command = {
  info: SlashCommandBuilder;
  call: CommandCall;
};
