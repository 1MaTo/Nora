import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type CommandCall = (interaction: ChatInputCommandInteraction) => Promise<unknown>;

export type Command = {
  info: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  isAdminCommand?: boolean;
  call: CommandCall;
};
