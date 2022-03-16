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

//  DELETE THIS

export const errorGameButton = new MessageButton()
  .setCustomId(buttonId.hostGame)
  .setLabel("Network error")
  .setStyle("DANGER")
  .setDisabled(true);

export const customErrorGameButton = (text: string) =>
  new MessageButton()
    .setCustomId(buttonId.hostGame)
    .setLabel(text)
    .setStyle("DANGER")
    .setDisabled(true);

export const loadingGameButton = new MessageButton()
  .setCustomId(buttonId.hostGame)
  .setLabel("Loading...")
  .setStyle("SECONDARY")
  .setDisabled(true);

export const hostGameButton = new MessageButton()
  .setCustomId(buttonId.hostGame)
  .setLabel("Host game")
  .setStyle("PRIMARY");

export const successGameButton = new MessageButton()
  .setCustomId(buttonId.hostGame)
  .setLabel("Game hosted")
  .setStyle("SUCCESS")
  .setDisabled(true);

export const unhostGameButton = new MessageButton()
  .setCustomId(buttonId.unhostGame)
  .setLabel("Unhost game")
  .setStyle("DANGER");

export const unhostSuccessGameButton = new MessageButton()
  .setCustomId(buttonId.unhostGame)
  .setLabel("Game unhosted")
  .setStyle("SUCCESS")
  .setDisabled(true);
