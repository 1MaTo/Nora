import { images } from "../strings/links";

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
            {
                name: "`Users`",
                value: users || "No one here... **Be the fisrt one (¬‿¬)**",
            },
        ],
        footer: {
            text: `${slotsTaken}/${slots}`,
            icon_url: images.gamelist.footerIcon,
        },
        thumbnail: {
            url: "https://i.ibb.co/swgV3HH/fbt-circle.png",
        },
    };
};
