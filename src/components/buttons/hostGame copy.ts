import { MessageButton, MessageButtonStyleResolvable } from "discord.js";
import { buttonId } from "../../utils/globals";

export type HostGameButtonProps = {
  label?: string;
  style?: MessageButtonStyleResolvable;
  disabled?: boolean;
};

export const hostGameButtonDefault = ({
  label,
  style,
  disabled,
}: HostGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.hostGame)
    .setLabel(label || "Host game")
    .setStyle(style || "PRIMARY")
    .setDisabled(disabled || false);
};

export const hostGameButtonLoading = ({
  label,
  style,
  disabled,
}: HostGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.hostGame)
    .setLabel(label || "Loading...")
    .setStyle(style || "SECONDARY")
    .setDisabled(disabled || true);
};

export const hostGameButtonSuccess = ({
  label,
  style,
  disabled,
}: HostGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.hostGame)
    .setLabel(label || "Game hosted")
    .setStyle(style || "SUCCESS")
    .setDisabled(disabled || true);
};

export const hostGameButtonError = ({
  label,
  style,
  disabled,
}: HostGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.hostGame)
    .setLabel(label || "Network error")
    .setStyle(style || "DANGER")
    .setDisabled(disabled || true);
};
