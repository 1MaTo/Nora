module.exports = {
    name: "test",
    args: 0,
    usage: "<one> <two>",
    description: "Just test command",
    guildOnly: true,
    run: (message, args) => {
        message.channel.send("nice reload");
    },
};
