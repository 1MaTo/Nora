import { logError } from "../../dist/utils";
import { logsForUsers } from "../config.json";
import { getLobby } from "../db/db";
import { dbErrors } from "../strings/logsMessages";
import { parseGameListToEmbed } from "../utils";

module.exports = {
    name: "lobby",
    args: 0,
    usage: "",
    cooldown: 5,
    description: "Show current lobby status",
    guildOnly: false,
    development: false,
    adminOnly: false,
    run: (message) => {
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
                    message.channel.send({ embed: game.embed });
                });
            }
        });
    },
};
