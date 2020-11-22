module.exports = {
    name: "test",
    args: 0,
    usage: "<one> <two>",
    description: "Just test command",
    guildOnly: true,
    development: true,
    adminOnly: false,
    run: (message, args) => {
        message.channel.send("sdsdddddds")
    },
};