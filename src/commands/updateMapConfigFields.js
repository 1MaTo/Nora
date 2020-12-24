const { dbErrors, mapConfigCommands } = require("../strings/logsMessages");
const { fbtSettings } = require("../../config.json");
const { logError, autodeleteMsg } = require("../utils");
const { getMapConfig, updateMapConfig } = require("../db/db");
const { fbtMapConfigRestrictions } = require("../strings/constants");

module.exports = {
    name: "updateMapConfigFields",
    args: 3,
    aliases: ["umcf"],
    usage: "<map> <field> <value> | <field> <value> | ...",
    description: "Use this command to change __optional__ fields in map config",
    guildOnly: true,
    development: false,
    adminOnly: false,
    run: (message, args) => {
        const map = args.shift();
        getMapConfig(message.guild.id, map, (config, error) => {
            if (error) return autodeleteMsg(message, mapConfigCommands.noConfigForMap);
            args.join(" ")
                .split("|")
                .forEach(configItem => {
                    const [field, value] = configItem.trim().split(" ");
                    if (!fbtMapConfigRestrictions[field]) return;
                    Object.entries(config).forEach(([key, _]) => {
                        if (
                            field === key.toLowerCase() &&
                            fbtMapConfigRestrictions[field].indexOf(value.toString()) !== -1
                        ) {
                            message.react("✅");
                            return (config.options[key] = value);
                        } else {
                            if (field === key.toLowerCase())
                                autodeleteMsg(
                                    message,
                                    mapConfigCommands.validFieldValues(key, fbtMapConfigRestrictions[field])
                                );
                        }
                    });
                });
            updateMapConfig(message.guild.id, map, JSON.stringify(config), (success, error) => {
                if (error) {
                    autodeleteMsg(message, mapConfigCommands.configUpdateFail);
                    return logError(message, new Error(error), dbErrors.queryError, fbtSettings.db);
                }
                return autodeleteMsg(message, mapConfigCommands.configUpdateSuccess);
            });
        });
    },
};
