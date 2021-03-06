import { guildIDs } from "../utils/globals";

export const ghostCommand = {
  name: "ghost",
  description: "Send command to ghost",
  guildID: guildIDs.ghostGuild,
  options: [
    {
      name: "pub",
      description: "host game",
      type: 1,
      options: [
        {
          name: "gamename",
          type: 3,
          description: "Game name",
          required: false,
        },
      ],
    },
    {
      name: "unhost",
      description: "Unhost game in lobby",
      type: 1,
    },
    {
      name: "start",
      description: "Start game in lobby",
      type: 1,
      options: [
        {
          name: "force",
          type: 5,
          description: "Skip checks or not",
          required: false,
        },
      ],
    },
    {
      name: "load",
      description: "Load map config from exist file",
      type: 1,
      options: [
        {
          name: "map",
          type: 3,
          description: "Choose from list of available configs",
          required: true,
          choices: [
            {
              name: "fbt",
              value: "fbt",
            },
            {
              name: "Dream",
              value: "Dream",
            },
            {
              name: "Flower",
              value: "Flower",
            },
            {
              name: "Dawn",
              value: "Dawn",
            },
          ],
        },
      ],
    },
    /*  {
      name: "map",
      description: "Load map config from map",
      type: 1,
      options: [
        {
          name: "name",
          type: 3,
          description: "Map name",
          required: true,
        },
      ],
    }, */
  ],
};
