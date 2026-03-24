import { REST, Routes } from "discord.js";

import { APP_ID, DEV_GUILD_ID, TOKEN } from "#env";

import { rawCommandList } from "../commands/shared/command-list.ts";

export const updateCommands = async (isProd?: boolean) => (isProd ? null : loadDev());

const loadDev = async () => {
  const rest = new REST().setToken(TOKEN);

  const data = (await rest.put(
    Routes.applicationGuildCommands(APP_ID, DEV_GUILD_ID),
    {
      body: rawCommandList.map((item) => item.info.toJSON()),
    },
    // todo: discordjs not typed result
  )) as { length: number };
  console.log(`[DEV] Successfully uploaded ${data.length} application (/) commands.`);
};
