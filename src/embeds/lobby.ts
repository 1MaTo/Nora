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
      {
        name: "Nickname",
        value: data.players.nicks,
        inline: true,
      },
      {
        name: "Ping",
        value: data.players.pings,
        inline: true,
      },
      {
        name: `${
          data.players.option.fieldName[0].toUpperCase() +
          data.players.option.fieldName.substr(1)
        }`,
        value: data.players.option.string,
        inline: true,
      },
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
