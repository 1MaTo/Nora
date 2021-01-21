const Discord = require("discord.js");
import axios from "axios";
import { ghost } from "../../auth.json";
import { ghostCommandLog } from "../strings/embeds";
import { botCommand } from "../strings/logsMessages";
import { autodeleteMsg, autodeleteReaction, checkValidChannel } from "../utils";

const botUrl = `http://${ghost.host}:${ghost.port}`;
const password = ghost.password;
const chatUrl = `${botUrl}/chat?pass=${password}`;
const checkChatUrl = `${botUrl}/checkchat`;
const commandUrl = command => `${botUrl}/cmd?pass=${password}&cmd=${escape(command)}`;

export const name = "bot";
export const args = 1;
export const aliases = ["b"];
export const usage = "<command to bot> | watch <channel> [max row count] [delay] | stop";
export const description = "Send command directly to ghost bot";
export const guildOnly = true;
export const adminOnly = false;
export const caseSensitive = true;

const validGuilds = ["408947483763277825", "556150178147467265"];

const watching = new Discord.Collection();

export const run = async (message, args) => {
    if (!validGuilds.includes(message.guild.id)) return autodeleteMsg(message, botCommand.wrongGuild);

    const command = args[0];

    if (command.toLowerCase() === "watch") {
        const isWatching = watching.has(message.guild.id);

        if (isWatching) return autodeleteMsg(message, botCommand.alreadyWatching);

        const channel = checkValidChannel(args[1], message);
        const maxRowCount = isNaN(args[2]) ? 18 : Number(args[2]);
        const delay = isNaN(args[3]) || Number(args[3]) < 200 ? 500 : Number(args[3]);

        const botMsg = await message.channel.send({ embed: ghostCommandLog("") });

        watching.set(message.guild.id, botMsg);

        setTimeout(() => checkChat(channel, maxRowCount, delay, message.guild.id), delay);

        return autodeleteMsg(message, botCommand.watchStarted(channel, maxRowCount, delay));
    }

    if (command.toLowerCase() === "stop") {
        const logMessage = watching.get(message.guild.id);
        if (logMessage) {
            logMessage.delete();
        }
        watching.delete(message.guild.id);
        return autodeleteReaction(message, "✅");
    }

    const ghostCommand = args.join(" ");
    const isAdmin = message.member.hasPermission("ADMINISTRATOR");

    if (!ghostCommand.match(/map|pub|unhost|getgame|getgames|load|start/g) && !isAdmin)
        return autodeleteMsg(message, botCommand.noPermisions);

    sendCommand(ghostCommand).then(response => {
        if (response) return autodeleteReaction(message, "✅", 1000);
        return autodeleteReaction(message, "❌", 1000);
    });
};

const getChatRows = () =>
    axios
        .get(checkChatUrl)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return null;
        });

const getChatMsg = () =>
    axios
        .get(chatUrl)
        .then(response => {
            const msg = response.data
                .toString()
                .replace(/&nbsp;/g, " ")
                .replace(/\[ {8}/g, "[")
                .split("<br>");
            msg.pop();
            return msg.reduce((arr, row) => {
                const ignore = row.match(/WSPR: w3.europebattle.net|UDPCMDSOCK/g);
                if (!ignore) {
                    return [...arr, row.substring(row.indexOf("]") + 2)];
                }
                return arr;
            }, []);
        })
        .catch(error => {
            return null;
        });

const checkChat = async (channel, maxRowCount, delay, guildId, oldRows = 0, chat = []) => {
    const logMessage = watching.get(guildId);

    if (!logMessage) return;

    const newRows = await getChatRows();

    let currRows = oldRows;

    if (Number(newRows) !== Number(currRows)) {
        currRows = newRows;

        const newChatMsg = await getChatMsg();

        if (newChatMsg) chat.push(...newChatMsg);

        if (chat.length > maxRowCount) chat.splice(0, chat.length - maxRowCount);

        await logMessage.edit({ embed: ghostCommandLog(chat.join("\n")) });
    }

    setTimeout(() => {
        checkChat(channel, maxRowCount, delay, guildId, currRows, chat);
    }, delay);
};

const sendCommand = command =>
    axios
        .get(commandUrl(command))
        .then(function (response) {
            return true;
        })
        .catch(function (error) {
            return null;
        });
