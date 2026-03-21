import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type CommandCall = (interaction: ChatInputCommandInteraction) => Promise<void>;

export type Command = {
  info: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  call: CommandCall;
};
