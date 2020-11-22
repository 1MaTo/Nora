import { logsForUsers } from "../../config.json";
import {
    commandNotFound,
    reloadCommand,
    runningCommandError
} from "../strings/logsMessages";
import { logError } from "../utils";

module.exports = {
    name: "reload",
    args: 1,
    usage: "<command>",
    description: "reload command",
    guildOnly: false,
    development: true,
    run: (message, args) => {
        const commandName = args[0];
        const commandToReload = message.client.commands.get(commandName);
        if (commandToReload) {
            delete require.cache[
                require.resolve(`./${commandToReload.name}.js`)
            ];
            try {
                var child_process = require("child_process");
                child_process.execSync("npm run rebuild-commands");
                const newCommand = require(`./${commandToReload.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                message.channel.send(
                    reloadCommand.commandReloaded(commandToReload.name)
                );
            } catch (error) {
                logError(
                    message,
                    error,
                    runningCommandError,
                    logsForUsers.failedInCommand
                );
            }
        } else {
            return message.channel.send(commandNotFound);
        }
    },
};
