import { ButtonInteraction, Message, MessageActionRow } from "discord.js";
import { startGame } from "../../api/ghost/startGame";
import { pauseLobbyWatcher } from "../../api/lobbyWatcher/pauseLobbyWatcher";
import { resetLobbyHubState } from "../../api/lobbyWatcher/resetLobbyHubState";
import { resumeLobbyWatcher } from "../../api/lobbyWatcher/resumeLobbyWatcher";
import {
  startGameButtonError,
  startGameButtonLoading,
  startGameButtonSuccess,
} from "../../components/buttons/startGame";
import { unhostGameButtonDefault } from "../../components/buttons/unhostGame";
import { botEvents } from "../../utils/events";
import { botStatusVariables, buttonId } from "../../utils/globals";
import { getCurrentLobbies } from "../../utils/lobbyParser";
import { pingUsersOnStart } from "../../utils/notifications";

module.exports = {
  id: buttonId.startGame,
  async execute(interaction: ButtonInteraction) {
    const message = interaction.message as Message;

    const resumeWatcherKey = await pauseLobbyWatcher(
      interaction.guildId,
      10000
    );

    await interaction.update({
      components: [
        new MessageActionRow().addComponents(
          startGameButtonLoading({ label: "Starting..." }),
          unhostGameButtonDefault({ disabled: true })
        ),
      ],
    });

    const games = await getCurrentLobbies(interaction.guildId);

    if (games.length === 0) {
      await message.edit({
        components: [
          new MessageActionRow().addComponents(
            startGameButtonError({ label: "This game not exist" }),
            unhostGameButtonDefault({ disabled: true })
          ),
        ],
      });
      resumeLobbyWatcher(interaction.guildId);
      clearTimeout(resumeWatcherKey);
      return;
    }

    const result = await startGame(true);

    let game = null;

    switch (result) {
      case "success":
        botStatusVariables.gameCount = botStatusVariables.gameCount + 1;
        botEvents.emit(botEvent.update);

        game = games.find(
          (game) => game.gamename == result.replace(/[\[\]]/g, "")
        );

        if (game) {
          pingUsersOnStart(game, interaction.guildId);
        }

        await message.edit({
          components: [
            new MessageActionRow().addComponents(
              startGameButtonSuccess({ label: "Started" }),
              unhostGameButtonDefault({ disabled: true })
            ),
          ],
        });
        break;
      case "timeout":
      case "error":
      case "uknown":
        botStatusVariables.gameCount = botStatusVariables.gameCount + 1;
        botEvents.emit(botEvent.update);

        game = games.find(
          (game) => game.gamename == result.replace(/[\[\]]/g, "")
        );

        if (game) {
          pingUsersOnStart(game, interaction.guildId);
        }

        await message.edit({
          components: [
            new MessageActionRow().addComponents(
              startGameButtonLoading({ label: "Waiting for data..." }),
              unhostGameButtonDefault({ disabled: true })
            ),
          ],
        });
        break;
      case null:
        await message.edit({
          components: [
            new MessageActionRow().addComponents(
              startGameButtonError(),
              unhostGameButtonDefault({ disabled: true })
            ),
          ],
        });
        break;
    }

    clearTimeout(resumeWatcherKey);
    await resetLobbyHubState(message, 3000);
    resumeLobbyWatcher(interaction.guildId);
  },
};
