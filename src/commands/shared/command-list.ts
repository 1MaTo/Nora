import { Collection } from "discord.js";

import type { Command } from "./type.ts";

import debug from "../debug.ts";
import warcraftTranslateAbilities from "../warcraft-translate-abilities.ts";

export const rawCommandList: Command[] = [debug, warcraftTranslateAbilities];

export const commandList = new Collection<string, Command>(
  rawCommandList.map((command) => [command.info.name, command]),
);
