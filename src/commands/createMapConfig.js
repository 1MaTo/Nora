const { dbErrors, mapConfigCommands } = require("../strings/logsMessages");
const { fbtSettings } = require("../../config.json");
const { logError, autodeleteMsg } = require("../utils");
const { updateMapConfig, searchMapConfigOrDefault } = require("../db/db");
const { getMapConfig } = require("../db/db");
const { defaultFbtOptionalConfig } = require("../strings/constants");

module.exports = {
    name: "createMapConfig",
    args: 3,
    aliases: ["updateMapConfig", "cmc", "umc"],
    usage: "<map> <slots> <team-slots> | <team-slots> | ...",
    description:
        "Create or Update map config.\n!WARNING! Do not count comp slots when use this command!\nExmaple: !cmc fbt 10 Team 1-4 | Team 2-4 | Spectators-2",
    guildOnly: true,
    development: false,
    adminOnly: false,
    run: async (message, args) => {
        const guildId = message.channel.guild.id;
        const map = args[0];
        const slots = args[1];
        const teams = args
            .splice(2)
            .join(" ")
            .split("|")
            .map(team => team.trim().split("-"));
        if (!map || !slots || !checkTeams(teams, slots)) {
            return autodeleteMsg(message, mapConfigCommands.badArgs);
        }

        getMapConfig(guildId, map, (config, error) => {
            let newConfig = {
                name: map,
                slots: Number(slots),
                options: defaultFbtOptionalConfig,
                slotMap: teams.map(team => {
                    return { slots: team[1], name: team[0] };
                }),
            };
            if (config) {
                newConfig = { ...config, ...newConfig };
            }
            updateMapConfig(guildId, map, JSON.stringify(newConfig), (success, error) => {
                if (error) {
                    autodeleteMsg(message, mapConfigCommands.configUpdateFail);
                    return logError(message, new Error(error), dbErrors.queryError, fbtSettings.db);
                }
                return autodeleteMsg(message, mapConfigCommands.configUpdateSuccess);
            });
        });
    },
};

const checkTeams = (teams, slots) => {
    var isValid = true;
    teams.forEach(team => {
        if (!team[0] || !team[1] || !team[0].length || !team[1].length || isNaN(team[1])) {
            isValid = false;
        }
    });
    if (!isValid) return isValid;
    if (Number(teams.map(team => team[1]).reduce((acc, curr) => Number(acc) + Number(curr))) !== Number(slots)) {
        isValid = false;
    }
    return isValid;
};
