import { prefix, logsForUsers } from "../../config.json";
import { helpCommand } from "../strings/logsMessages";
import { autodeleteMsg, logError } from "../utils";

module.exports = {
    name: "help",
    args: 0,
    usage: "[command name]",
    description: "Sending all available commands in DM",
    guildOnly: false,
    run: (message, args) => {
        const { commands } = message.client;
        if (args.length) {
            const commandName = args[0];
            const command = commands.get(commandName);
            if (command.name === 'help') return;
            if (!command) {
                return autodeleteMsg(message, "Undefined command");
            }
            message.channel.send(
                helpCommand.singleCommandInfo(prefix, command)
            );
        } else {
            const data = [];
            data.push(helpCommand.commandList);
            commands.forEach((command) => {
                if (command.development || command.name === 'help') return;
                data.push(
                    helpCommand.commandShort(
                        prefix,
                        command.name,
                        command.usage,
                        command.description
                    )
                );
            });
            data.push(helpCommand.tipForSingleCommand(prefix));
            return message.author.send(data, { split: true }).catch((error) => {
                logError(message, error.message, logsForUsers.cantSendDM);
            });
        }
    },
};
