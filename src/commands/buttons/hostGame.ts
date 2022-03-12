import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { pubGame } from "../../api/ghost/pubGame";
import {
  customErrorGameButton,
  errorGameButton,
  loadingGameButton,
  successGameButton,
} from "../../components/buttons/hostGame";
import { botStatusInfo } from "../../utils/events";
import {
  botStatusVariables,
  buttonId,
  ghostGuildBotId,
} from "../../utils/globals";
import { getCurrentLobbies } from "../../utils/lobbyParser";

module.exports = {
  id: buttonId.hostGame,
  async execute(interaction: ButtonInteraction) {
    await interaction.update({
      components: [new MessageActionRow().addComponents(loadingGameButton)],
    });

    const games = await getCurrentLobbies(interaction.guildId);

    if (games.some((game) => game.botid === ghostGuildBotId)) {
      await (interaction.message as Message).edit({
        components: [
          new MessageActionRow().addComponents(
            customErrorGameButton("Lobby already exist")
          ),
        ],
      });
      return;
    }

    const result = await pubGame("res publica game");

    switch (result) {
      case "success":
      case "timeout":
        botStatusVariables.lobbyCount = botStatusVariables.lobbyCount + 1;
        botStatusInfo.emit(botEvent.update);

        await (interaction.message as Message).edit({
          components: [new MessageActionRow().addComponents(successGameButton)],
        });
        return;
      case "error":
      case "uknown":
        await (interaction.message as Message).edit({
          components: [
            new MessageActionRow().addComponents(
              customErrorGameButton("No config loaded")
            ),
          ],
        });
        return;
      case null:
        await (interaction.message as Message).edit({
          components: [new MessageActionRow().addComponents(errorGameButton)],
        });
        return;
    }
  },
};
