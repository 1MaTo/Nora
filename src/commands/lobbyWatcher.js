import { logError } from "../../dist/utils";
import { logsForUsers } from "../config.json";
import { getLobby } from "../db/db";
import { dbErrors, lobbyCommand } from "../strings/logsMessages";
import { parseGameListToEmbed } from "../utils";

module.exports = {
    name: "lobbyWatcher",
    args: 1,
    usage: "<start | stop>",
    description:
        "(DEVELOPMENT) Frequently looking for games in real time until you stop",
    guildOnly: true,
    run: (message) => {
        /* if (lobbySetting.lookingForGames)
            return message.channel.send(lobbyCommand.alreadyLooking);

        lobbySetting.lookingForGames = true;
        getLobby((result, error) => {
            if (error) {
                return logError(
                    message,
                    new Error(error),
                    dbErrors.queryError,
                    logsForUsers.db
                );
            } else {
                if (!result)
                    return message.channel.send(
                        "No games on lobby right now D:"
                    );
                parseGameListToEmbed(result).forEach((game) => {
                    message.channel.send({ embed: game });
                    const key = setTimeout();
                });
            }
        });*/
    },
};
