import { MessageButton, MessageButtonStyleResolvable } from "discord.js";
import { buttonId } from "../../utils/globals";

export type ShowConfigSelectorButtonProps = {
  label?: string;
  style?: MessageButtonStyleResolvable;
  disabled?: boolean;
};

export const showConfigSelectorButtonDefault = ({
  label,
  style,
  disabled,
}: ShowConfigSelectorButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.showConfigSelector)
    .setLabel(label || "Show config loader")
    .setStyle(style || "PRIMARY")
    .setDisabled(disabled || false);
};

export const showConfigSelectorButtonLoading = ({
  label,
  style,
  disabled,
}: ShowConfigSelectorButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.showConfigSelector)
    .setLabel(label || "Loading...")
    .setStyle(style || "SECONDARY")
    .setDisabled(disabled || true);
};

export const showConfigSelectorButtonSuccess = ({
  label,
  style,
  disabled,
}: ShowConfigSelectorButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.showConfigSelector)
    .setLabel(label || "Select map config")
    .setStyle(style || "SUCCESS")
    .setDisabled(disabled || true);
};

export const showConfigSelectorButtonError = ({
  label,
  style,
  disabled,
}: ShowConfigSelectorButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.showConfigSelector)
    .setLabel(label || "Network error")
    .setStyle(style || "DANGER")
    .setDisabled(disabled || true);
};
