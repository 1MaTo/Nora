import { MessageActionRow } from "discord.js";
import { hostGameButtonDefault } from "../components/buttons/hostGame";
import { showConfigSelectorButtonDefault } from "../components/buttons/showConfigSelector";

export const getGameCommandsHub = () => {
  return [
    new MessageActionRow().addComponents(
      hostGameButtonDefault(),
      showConfigSelectorButtonDefault()
    ),
  ];
};

//  DELETE THIS
