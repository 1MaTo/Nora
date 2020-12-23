const { dbErrors } = require("../strings/logsMessages");
const { fbtSettings } = require("../../config.json");
const { logError, autodeleteMsg } = require("../utils");

module.exports = {
    name: "spectatorLivesMatter",
    args: 0,
    aliases: ["slm"],
    usage: "",
    description:
        "Command to toggle spectatorLivesMatter setting.\nIf ON !needPLayer command will count spectators.\nIf OFF !needPlayer won't count spectators.\n!! work only if map config has «Spectators» team",
    guildOnly: true,
    development: true,
    adminOnly: false,
    run: (message, args) => {},
};
