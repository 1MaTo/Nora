import { Message, MessageActionRow, MessageButton } from "discord.js";
import { startGameButtonDefault } from "../../components/buttons/startGame";
import { unhostGameButtonDefault } from "../../components/buttons/unhostGame";
import { buttonId } from "../../utils/globals";
import { log } from "../../utils/log";
import { sleep } from "../../utils/sleep";

export const resetLobbyHubState = async (
  message: any,
  delay: number = 2000
) => {
  await sleep(delay);

  const startButton =
    (message.resolveComponent(buttonId.startGame) as MessageButton) ||
    (startGameButtonDefault() as MessageButton);
  const unhostButton =
    (message.resolveComponent(buttonId.unhostGame) as MessageButton) ||
    (unhostGameButtonDefault() as MessageButton);

  try {
    await (message as Message).edit({
      components: [
        new MessageActionRow().addComponents(
          startButton.style === "SUCCESS"
            ? startButton
            : startGameButtonDefault(),
          startButton.style === "SUCCESS"
            ? unhostButton
            : unhostButton.setDisabled(false)
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
