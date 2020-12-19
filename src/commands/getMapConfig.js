const { getMapConfig, getMapNames } = require("../db/db");
const { dbErrors, mapConfigCommands } = require("../strings/logsMessages");
const { logsForUsers } = require("../../config.json");
const { logError, autodeleteMsg } = require("../utils");
const { mapConfig, mapConfigList } = require("../strings/embeds");

module.exports = {
    name: "getmapconfig",
    args: 0,
    aliases: ["gmc"],
    usage: "[map name]",
    description: "Show list of map names for this server. Specify map name to show map config",
    guildOnly: true,
    development: false,
    adminOnly: false,
    run: (message, args) => {
        const mapName = args[0];
        const guildId = message.channel.guild.id;
        if (mapName) {
            getMapConfig(guildId, mapName, (config, error) => {
                if (error) {
                    autodeleteMsg(message, mapConfigCommands.noConfigForMap);
                    return logError(message, new Error(error), dbErrors.queryError, logsForUsers.db);
                }
                return autodeleteMsg(message, { embed: mapConfig({ configName: mapName, ...config }) }, 20000);
            });
        } else {
            getMapNames(guildId, (mapNames, error) => {
                if (error) {
                    autodeleteMsg(message, mapConfigCommands.noMapConfigs);
                    return logError(message, new Error(error), dbErrors.queryError, logsForUsers.db);
                }
                return autodeleteMsg(message, { embed: mapConfigList(mapNames) }, 20000);
            });
        }
    },
};
