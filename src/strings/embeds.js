import { images } from "../strings/links";

const usersInLobby = (users) => {
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

export const lobbyObserver = ({
    name,
    map,
    host,
    owner,
    slots,
    slotsTaken,
    users,
}) => {
    return {
        color: 0,
        fields: [
            {
                name: "`Game`",
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
            text: `${slotsTaken}/${slots}`,
            icon_url: images.gamelist.footerIcon,
        },
        thumbnail: {
            url: images.gamelist.thumbnail,
        },
    };
};
