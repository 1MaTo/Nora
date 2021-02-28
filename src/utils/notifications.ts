import { info } from "../embeds/response";
import { USER_LOBBY_PREFIX } from "./lobbyParser";
import { getDiscordUsersFromNicknames } from "./nicknameToDiscordUser";

export const pingUsersOnStart = async (
  game: lobbyInfo<lobbyTable[]>,
  guildID: string
) => {
  const nicknames = game.players.map((player) =>
    player.name.substr(USER_LOBBY_PREFIX.length)
  );
  const users = (await getDiscordUsersFromNicknames(nicknames, guildID)).filter(
    (user) => user.settings.ping_on_start
  );
  users.map((user) => user.user.send({ embed: info("Game started") }));
};
