const { dbErrors } = require("../strings/logsMessages");
const { fbtSettings } = require("../../config.json");
const { logError, autodeleteMsg } = require("../utils");

module.exports = {
    name: "test",
    args: 0,
    aliases: ["t", "te"],
    usage: "<one> <two>",
    description: "Just test command",
    guildOnly: true,
    development: true,
    adminOnly: false,
    run: (message, args) => {
        console.log(args[0]);
        message.channel.send("hi");
    },
};
