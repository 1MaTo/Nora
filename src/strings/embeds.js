import { images } from "../strings/links";
import { parseDuration, parseTimePast, toFirstLetterUpperCase } from "../utils";
import { colors, emptyField, SPACE } from "./constants";

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

export const mapConfig = ({ configName, name, slots, slotMap, options }) => {
    return {
        title: `${configName}`,
        description: `
        __Optional config__

        ${Object.entries(options)
            .map(([key, value]) => `[${key}]: **${value}**`)
            .join("\n")}

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
            .map(
                command =>
                    `> \`${prefix}${command.name}\` ${command.usage}\n${
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

export const gameStatsPoll = (gameData, color, winTeam = null) => {
    return {
        title: gameData.gamename,
        color: color,
        fields: gameData.players.map((team, index) => {
            return {
                name: toFirstLetterUpperCase(team.teamName),
                value: team.teamPlayers
                    .map(player => (winTeam === index ? `🏆 ${player.name}` : player.name))
                    .join("\n"),
                inline: true,
            };
        }),
        author: {
            name: gameData.map,
        },
        footer: {
            text: parseDuration(Number(gameData.duration) * 1000),
        },
        timestamp: new Date(gameData.datetime),
    };
};

export const defaultEmbed = (title, body, color = colors.black) => {
    return {
        title: title,
        description: body,
        color: color,
    };
};

export const totalGamesForNicknames = (nicknames, games, color = colors.black) => {
    return {
        description: `${games.groupedGames
            .map(group => {
                if (group.versions.length === 1)
                    return `:map: [**${group.totalGames}**] __${group.versions[0].mapVersion}__`;
                return `:map: [**${group.totalGames}**] __${group.map}__\n
            ${group.versions
                .map(version => `> :small_blue_diamond: [**${version.gamesCount}**] ${version.mapVersion}`)
                .join("\n")}`;
            })
            .join("\n\n")}`,
        color: color,
        author: {
            name: `All games for [${nicknames.join("], [")}]`,
            icon_url: images.fbtMasterMale,
        },
        footer: {
            text: `${games.totalGameCount} games`,
        },
    };
};
