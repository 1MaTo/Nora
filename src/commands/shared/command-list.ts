import { Collection } from "discord.js";

import type { Command } from "./type.ts";

import debug from "../debug.ts";

export const rawCommandList: Command[] = [debug];

export const commandList = new Collection<string, Command>(
  rawCommandList.map((command) => [command.info.name, command]),
);
