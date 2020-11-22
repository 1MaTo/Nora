module.exports = {
    name: "test",
    args: 0,
    usage: "<one> <two>",
    description: "Just test command",
    guildOnly: true,
    development: true,
    adminOnly: false,
    run: (message, args) => {
        console.log(process.env)
        message.channel.send()
    },
};