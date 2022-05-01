import { MessageButton, MessageButtonStyleResolvable } from "discord.js";
import { buttonId } from "../../utils/globals";

export type RefreshWatcherButtonProps = {
  label?: string;
  style?: MessageButtonStyleResolvable;
  disabled?: boolean;
};

export const refreshWatcherButtonDefault = ({
  label,
  style,
  disabled,
}: RefreshWatcherButtonProps = {}) => {
  return new MessageButton()
    .setCustomId(buttonId.refreshWatcher)
    .setLabel(label || "")
    .setStyle(style || "SECONDARY")
    .setEmoji("🔄")
    .setDisabled(disabled || false);
};
