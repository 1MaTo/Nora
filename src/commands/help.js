import { prefix, logsForUsers } from "../../config.json";
import { helpAllCommands, helpSingleCommand } from "../strings/embeds";
import { helpCommand } from "../strings/logsMessages";
import { autodeleteMsg, logError } from "../utils";

module.exports = {
    name: "help",
    args: 0,
    aliases: ["h"],
    usage: "[command name]",
    description: "Sending all available commands in DM",
    guildOnly: false,
    run: (message, args) => {
        const { commands } = message.client;
        if (args.length) {
            const commandName = args[0];
            const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (command.name === "help") return;
            if (!command) {
                return autodeleteMsg(message, "Undefined command");
            }
            autodeleteMsg(message, { embed: helpSingleCommand(prefix, command) }, 15000 /* helpCommand.singleCommandInfo(prefix, command) */);
        } else {
            return message.author.send({ embed: helpAllCommands(prefix, commands) }).catch(error => {
                logError(message, error.message, logsForUsers.cantSendDM);
            });
        }
    },
};
