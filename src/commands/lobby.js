import { logError } from "../../dist/utils";
import { lobbySetting } from "../bot";
import { logsForUsers } from "../config.json";
import { getLobby } from "../db/db";
import { dbErrors, lobbyCommand } from "../strings/logsMessages";
import { parseGameListToEmbed } from "../utils";

module.exports = {
    name: "lobby",
    args: 0,
    usage: "",
    cooldown: 5,
    description: "Show current lobby status",
    guildOnly: false,
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
                    message.channel.send({ embed: game });
                });
            }
        });
    },
};
