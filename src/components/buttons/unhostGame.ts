import { MessageButton, MessageButtonStyleResolvable } from "discord.js";
import { buttonId } from "../../utils/globals";

export type UnhostGameButtonProps = {
  label?: string;
  style?: MessageButtonStyleResolvable;
  disabled?: boolean;
};

export const unhostGameButtonDefault = ({
  label,
  style,
  disabled,
}: UnhostGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.unhostGame)
    .setLabel(label || "Unhost game")
    .setStyle(style || "DANGER")
    .setDisabled(disabled || false);
};

export const unhostGameButtonLoading = ({
  label,
  style,
  disabled,
}: UnhostGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.unhostGame)
    .setLabel(label || "Loading...")
    .setStyle(style || "SECONDARY")
    .setDisabled(disabled || true);
};

export const unhostGameButtonSuccess = ({
  label,
  style,
  disabled,
}: UnhostGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.unhostGame)
    .setLabel(label || "Game unhosted")
    .setStyle(style || "SUCCESS")
    .setDisabled(disabled || true);
};

export const unhostGameButtonError = ({
  label,
  style,
  disabled,
}: UnhostGameButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.unhostGame)
    .setLabel(label || "Network error")
    .setStyle(style || "DANGER")
    .setDisabled(disabled || true);
};
