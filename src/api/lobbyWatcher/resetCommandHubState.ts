import { Message, MessageActionRow } from "discord.js";
import { hostGameButtonDefault } from "../../components/buttons/hostGame";
import { showConfigSelectorButtonDefault } from "../../components/buttons/showConfigSelector";
import { log } from "../../utils/log";
import { sleep } from "../../utils/sleep";

export const resetCommandHubState = async (
  message: any,
  delay: number = 2000
) => {
  await sleep(delay);
  try {
    await (message as Message).edit({
      components: [
        new MessageActionRow().addComponents(
          hostGameButtonDefault(),
          showConfigSelectorButtonDefault()
        ),
      ],
    });
    return;
  } catch (err) {
    log("[reset command hub] cant edit msg");
    return;
  }
};
