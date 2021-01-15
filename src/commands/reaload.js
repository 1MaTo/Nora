import { fbtSettings } from "../../config.json";
import { commandNotFound, reloadCommand, runningCommandError } from "../strings/logsMessages";
import { autodeleteMsg, changeBotStatus, logError } from "../utils";

module.exports = {
    name: "reload",
    args: 0,
    usage: "<command>",
    description: "reload command",
    guildOnly: false,
    development: true,
    run: async (message, args) => {
        const commandName = args[0];
        if (!commandName) {
            await changeBotStatus("🔁Reboot...🔁");
            autodeleteMsg(message, reloadCommand.reboot);
            try {
                let child_process = require("child_process");
                return child_process.execSync("npm run prod_restart");
            } catch (error) {
                console.log(error);
                return autodeleteMsg(message, reloadCommand.errorReboot);
            }
        }
        const commandToReload =
            message.client.commands.get(commandName) ||
            message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (commandToReload) {
            delete require.cache[require.resolve(`./${commandToReload.name}.js`)];
            try {
                var child_process = require("child_process");
                child_process.execSync("npm run rebuild-commands");
                const newCommand = require(`./${commandToReload.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                message.channel.send(reloadCommand.commandReloaded(commandToReload.name));
            } catch (error) {
                logError(message, error, runningCommandError, fbtSettings.failedInCommand);
            }
        } else {
            return message.channel.send(commandNotFound);
        }
    },
};
