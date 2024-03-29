import { MessageActionRow } from "discord.js";
import {
  hostGameButtonDefault,
  hostGameButtonSuccess,
} from "../../components/buttons/hostGame";
import { refreshWatcherButtonDefault } from "../../components/buttons/refreshWatcher";
import { showConfigSelectorButtonDefault } from "../../components/buttons/showConfigSelector";

export const getCommandHubState = (isLobbyExist: boolean) => {
  return [
    new MessageActionRow().addComponents(
      isLobbyExist ? hostGameButtonSuccess() : hostGameButtonDefault(),
      showConfigSelectorButtonDefault({ disabled: isLobbyExist }),
      refreshWatcherButtonDefault()
    ),
  ];
};
