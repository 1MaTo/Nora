import { MessageButton, MessageButtonStyleResolvable } from "discord.js";
import { buttonId } from "../../utils/globals";

export type StartGameButtonProps = {
  label?: string;
  style?: MessageButtonStyleResolvable;
  disabled?: boolean;
};

export const startGameButtonDefault = ({
  label,
  style,
  disabled,
}: StartGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.startGame)
    .setLabel(label || "Start game")
    .setStyle(style || "PRIMARY")
    .setDisabled(disabled || false);
};

export const startGameButtonLoading = ({
  label,
  style,
  disabled,
}: StartGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.startGame)
    .setLabel(label || "Loading...")
    .setStyle(style || "SECONDARY")
    .setDisabled(disabled || true);
};

export const startGameButtonSuccess = ({
  label,
  style,
  disabled,
}: StartGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.startGame)
    .setLabel(label || "Game started")
    .setStyle(style || "SUCCESS")
    .setDisabled(disabled || true);
};

export const startGameButtonError = ({
  label,
  style,
  disabled,
}: StartGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.startGame)
    .setLabel(label || "Network error")
    .setStyle(style || "DANGER")
    .setDisabled(disabled || true);
};
