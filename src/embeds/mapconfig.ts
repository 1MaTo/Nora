export const mapConfigInfo = (cfg: mapConfig) => {
  const image = cfg.options.mapImage && {
    thumbnail: {
      url: cfg.options.mapImage,
    },
  };

  return {
    title: `※ ${cfg.name}`,
    description: `**${cfg.slots}** slots`,
    color: null,
    fields: [
      {
        name: "※ Spectators",
        value: `\`${cfg.options.spectatorLivesMatter}\``,
      },
      {
        name: "※ Ranking",
        value: `\`${cfg.options.ranking}\``,
      },
      {
        name: "※ Group",
        value: cfg.slotMap.map((team) => team.name).join("\n"),
        inline: true,
      },
      {
        name: "※ Players",
        value: cfg.slotMap.map((team) => team.slots).join("\n"),
        inline: true,
      },
    ],
    author: {
      name: "Map config",
    },
    ...image,
  };
};

export const mapConfigList = (list: Array<string>) => {
  return {
    description: list.length ? list.join("\n") : "*No configs for this server*",
    color: null,
    author: {
      name: "※ Config list",
    },
  };
};
