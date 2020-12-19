const { dbErrors, mapConfigCommands } = require("../strings/logsMessages");
const { logsForUsers } = require("../../config.json");
const { logError, autodeleteMsg } = require("../utils");
const { deleteMapConfig } = require("../db/db");

module.exports = {
    name: "deleteMapConfig",
    args: 1,
    aliases: ["dmc"],
    usage: "<map>",
    description: "Delete map config",
    guildOnly: true,
    development: false,
    adminOnly: false,
    run: (message, args) => {
        const guildId = message.channel.guild.id;
        const map = args[0];
        deleteMapConfig(guildId, map, (result, error) => {
            if (error) {
                autodeleteMsg(message, mapConfigCommands.configDeleteFail);
                return logError(message, new Error(error), dbErrors.queryError, logsForUsers.db);
            }
            return autodeleteMsg(message, mapConfigCommands.configDeleteSuccess);
        });
    },
};
