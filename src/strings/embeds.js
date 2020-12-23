import { images } from "../strings/links";
import { parseTimePast } from "../utils";
import { SPACE } from "./constants";

const usersInLobby = users => {
    if (users)
        return [
            {
                name: "`Nickname`",
                value: users.nicks,
                inline: true,
            },
            {
                name: "`Ping`",
                value: users.pings,
                inline: true,
            },
            {
                name: "`Server`",
                value: users.servers,
                inline: true,
            },
        ];
    else {
        return [
            {
                name: "‎‏‏‎ ..................................................",
                value: "*No players in this game yet :C*",
            },
        ];
    }
};

export const lobbyObserver = ({ name, map, host, owner, slots, slotsTaken, users, botid }, timeFromStart) => {
    return {
        botid: botid,
        embed: {
            color: 0,
            fields: [
                {
                    name: `\`Game#${botid}\``,
                    value: name,
                    inline: true,
                },
                {
                    name: "‎‏‏‎ ‎",
                    value: "‎‏‏‎ ‎\n",
                    inline: true,
                },
                {
                    name: "`Map`",
                    value: map,
                    inline: true,
                },
                {
                    name: "`Host`",
                    value: host,
                    inline: true,
                },
                {
                    name: "‎‏‏‎ ‎",
                    value: "‎‏‏‎ ‎\n",
                    inline: true,
                },
                {
                    name: "`Owner`",
                    value: owner,
                    inline: true,
                },
                usersInLobby(users),
            ],
            footer: {
                text: `${slotsTaken}/${slots}${SPACE + SPACE}[${parseTimePast(timeFromStart)}]`,
                icon_url: images.gamelist.footerIcon,
            },
        },
    };
};

export const mapConfig = ({ configName, name, slots, slotMap, spectatorLivesMatter }) => {
    return {
        title: `${configName}`,
        description: `
        __Optional config__

        [spectatorLivesMatter]: **${spectatorLivesMatter}**

        __Main config__

        [name]: **${name}**
        [slots]: **${slots}**
        [teams]:
        `,
        color: null,
        fields: [
            {
                name: `\`Team\``,
                value: `${slotMap.map(item => item.name[0].toUpperCase() + item.name.substr(1)).join("\n")}`,
                inline: true,
            },
            {
                name: `\`Slots\``,
                value: `${slotMap.map(item => item.slots).join("\n")}`,
                inline: true,
            },
        ],
    };
};

export const mapConfigList = configList => {
    return {
        title: "Config list",
        description: `${configList.join("\n")}`,
        color: null,
    };
};

export const helpAllCommands = (prefix, commands) => {
    return {
        title: "Command list",
        description: commands
            .map(command =>
                command.development
                    ? ""
                    : `> \`${prefix}${command.name}\` ${command.usage}\n${
                          command.aliases ? `> \`${command.aliases.map(alias => `${prefix}${alias}`).join(" ")}\`\n` : ""
                      }\`\`\`${command.description}\`\`\``
            )
            .join(`\n\n`),
        color: null,
    };
};

export const helpSingleCommand = (prefix, { name, description, usage, aliases }) => {
    return {
        title: name,
        color: null,
        fields: [
            {
                name: "Usage",
                value: `\`\`\`${prefix}${name} ${usage}\`\`\``,
            },
            {
                name: "Description",
                value: `\`\`\`${description}\`\`\``,
            },
            {
                name: "Aliases",
                value: `\`\`\`${aliases.map(alias => `${prefix}${alias}`).join(" ")}\`\`\``,
            },
        ],
    };
};
