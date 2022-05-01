import { Message, MessageActionRow } from "discord.js";
import {
  hostGameButtonDefault,
  hostGameButtonSuccess,
} from "../../components/buttons/hostGame";
import { refreshWatcherButtonDefault } from "../../components/buttons/refreshWatcher";
import {
  showConfigSelectorButtonDefault,
  showConfigSelectorButtonError,
  showConfigSelectorButtonSuccess,
} from "../../components/buttons/showConfigSelector";
import { getLobbyList } from "../../db/queries";
import { ghostGuildBotId } from "../../utils/globals";
import { log } from "../../utils/log";
import { sleep } from "../../utils/sleep";

export const resetCommandHubState = async (
  message: any,
  delay: number = 2000,
  config?: {
    result: "success" | "error";
    text?: string;
  }
) => {
  const lobbyList = await getLobbyList();
  const isLobbyExist =
    lobbyList && lobbyList.some((lobby) => lobby.botid === ghostGuildBotId);

  await sleep(delay);

  try {
    await (message as Message).edit({
      components: [
        new MessageActionRow().addComponents(
          isLobbyExist ? hostGameButtonSuccess() : hostGameButtonDefault(),
          config
            ? config.result === "success"
              ? showConfigSelectorButtonSuccess({ label: config.text })
              : showConfigSelectorButtonError({ label: config.text })
            : showConfigSelectorButtonDefault({ disabled: isLobbyExist }),
          refreshWatcherButtonDefault()
        ),
      ],
    });
    log("[reset command hub] hub reset complete");
    return;
  } catch (err) {
    log("[reset command hub] cant edit msg");
    return;
  }
};
