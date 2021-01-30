import { EMPTY_LOBBY_USER_NAME, SPACE } from "../utils/lobbyParser";

export const lobbyGame = (data: lobbyInfo<lobbyStrings>, uptime: string) => {
  const main = {
    color: null,
    fields: [
      {
        name: `※ Game #${data.botid}`,
        value: `\`\`\`\n${data.gamename}\n\`\`\``,
        inline: true,
      },
      {
        name: "※ Host | Owner",
        value: `\`\`\`css\n[${data.host}] ${data.owner}\n\`\`\``,
        inline: true,
      },
      {
        name: "※ Map",
        value: `\`\`\`c\n${data.mapname}\n\`\`\``,
      },
      ...playersTable(data.players, data.slotsTaken === 0),
    ],
    footer: {
      text: `${data.slotsTaken}/${data.slots} [ ${uptime} ]‎‏‏‎`,
      icon_url:
        "https://images-ext-1.discordapp.net/external/fMfBC85Ij1hFNbsEgcrf40GVrd3iYU-VQpdWUrE97ls/https/www.flaticon.com/premium-icon/icons/svg/668/668709.svg",
    },
  };

  const image = data.mapImage && {
    thumbnail: {
      url: data.mapImage,
    },
  };

  return {
    ...main,
    ...image,
  };
};

export const header = (gameCount: number, time: string) => {
  return {
    description: `※ **${gameCount}** *active lobby*`,
    color: null,
    footer: {
      text: `[ ${time} ]`,
    },
  };
};

const playersTable = (players: lobbyStrings, empty: boolean) => {
  if (empty)
    return [
      {
        name: "※ Empty lobby",
        value: SPACE,
        inline: false,
      },
    ];
  return [
    {
      name: "Nickname",
      value: players.nicks,
      inline: true,
    },
    {
      name: "Ping",
      value: players.pings,
      inline: true,
    },
    {
      name: `${
        players.option.fieldName[0].toUpperCase() +
        players.option.fieldName.substr(1)
      }`,
      value: players.option.string,
      inline: true,
    },
  ];
};
