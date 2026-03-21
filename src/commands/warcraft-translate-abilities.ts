import { SlashCommandBuilder } from "discord.js";

import type { Command } from "./shared/type.ts";

import { InvalidPayloadError } from "../utils/shared/error/invalid-payload-error.ts";
import { UnexpectedCommandError } from "../utils/shared/error/unexpected-command-error.ts";

const filename = "file";

export default {
  info: new SlashCommandBuilder()
    .setName("warcraft-translate-abilities")
    .setDescription('Translates "CampaignAbilityStrings" file')
    .addAttachmentOption((option) =>
      option.setName(filename).setDescription("CampaignAbilityStrings.txt").setRequired(true),
    ),

  call: async (interaction) => {
    const { contentType, url } = interaction.options.getAttachment(filename);

    if (!contentType.includes("text/plain")) {
      throw new InvalidPayloadError("File must be .txt");
    }

    const response = await fetch(url);

    if (!response.body) throw new UnexpectedCommandError("Empty file");
    for await (const line of readLinesFromStream(response.body)) {
      const headerToTranslate = /^Name=.+/;
      const matchResult = line.match(headerToTranslate);
      if (!matchResult) continue;
      console.log("match found");
      const content = line.replace(matchResult[1], "");
      console.log(content);
    }

    await interaction.reply("debug");
  },
} satisfies Command;

async function* readLinesFromStream(stream: ReadableStream) {
  const decoder = new TextDecoder("utf-8");
  let leftover = "";

  for await (const chunk of stream) {
    leftover += decoder.decode(chunk, { stream: true });

    const lines = leftover.split(/\r?\n/);
    leftover = lines.pop() || "";

    for (const line of lines) {
      yield line;
    }
  }

  yield leftover;
}
