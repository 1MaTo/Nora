import { Collection } from "discord.js";

import debug from "../debug.ts";
import warcraftTranslateAbilities from "../warcraft-translate-abilities.ts";
import type { Command } from "./type.ts";

export const rawCommandList: Command[] = [debug, warcraftTranslateAbilities];

export const commandList = new Collection<string, Command>(
  rawCommandList.map((command) => [command.info.name, command]),
);
