import { MessageButton } from "discord.js";
import { buttonId } from "../../utils/globals";

export const errorGameButton = new MessageButton()
  .setCustomId(buttonId.hostGame)
  .setLabel("Network error")
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
  .setDisabled(false);
