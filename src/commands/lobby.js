import { logError } from "../utils";
import { fbtSettings } from "../../config.json";
import { getLobby } from "../db/db";
import { dbErrors, lobbyCommand } from "../strings/logsMessages";
import { autodeleteMsg, parseGameListToEmbed } from "../utils";

module.exports = {
    name: "lobby",
    args: 0,
    aliases: ["l"],
    usage: "",
    cooldown: 5,
    description: "Show current lobby status",
    guildOnly: false,
    dmOnly: true,
    development: true,
    adminOnly: false,
    run: message => {
        getLobby((result, error) => {
            if (error) {
                return logError(message, new Error(error), dbErrors.queryError, fbtSettings.db);
            } else {
                if (!result) return autodeleteMsg(message, lobbyCommand.noGamesInLobby);
                parseGameListToEmbed(result).forEach(game => {
                    message.channel.send({ embed: game.embed });
                });
            }
        });
    },
};
