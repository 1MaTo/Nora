import {
  AttachmentBuilder,
  inlineCode,
  SlashCommandBuilder,
  type APIApplicationCommandOptionChoice,
} from "discord.js";
import { writeFile } from "node:fs/promises";

import type { Command } from "./shared/type.ts";

import { InvalidPayloadError } from "../utils/shared/error/invalid-payload-error.ts";
import { UnexpectedCommandError } from "../utils/shared/error/unexpected-command-error.ts";
import { translateApi } from "../utils/translate/translate-api.ts";
import { TranslateLanguage, TranslateProvider } from "../utils/translate/types.ts";

const filename = "file";
const source = "source";
const target = "target";
const provider = "provider";

const languageChoices: APIApplicationCommandOptionChoice<string>[] = [
  {
    name: "Korean",
    value: TranslateLanguage.enum.ko,
  },
  {
    name: "Chinese",
    value: TranslateLanguage.enum.zh,
  },
  {
    name: "English",
    value: TranslateLanguage.enum.en,
  },
  {
    name: "Russian",
    value: TranslateLanguage.enum.ru,
  },
];

export default {
  info: new SlashCommandBuilder()
    .setName("warcraft-translate-abilities")
    .setDescription('Translates "CampaignAbilityStrings" file')
    .addStringOption((option) =>
      option
        .setName(source)
        .setDescription("Language to translate from, any other languages will not be translated")
        .addChoices(...languageChoices)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName(target)
        .setDescription("Language to translate to")
        .addChoices(...languageChoices)
        .setRequired(true),
    )
    .addAttachmentOption((option) =>
      option.setName(filename).setDescription("CampaignAbilityStrings.txt").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName(provider)
        .setDescription("Translation provider, google by default")
        .addChoices(
          { name: TranslateProvider.enum.google, value: TranslateProvider.enum.google },
          { name: TranslateProvider.enum.yandex, value: TranslateProvider.enum.yandex },
        ),
    ),
  isAdminCommand: true,
  call: async (interaction) => {
    await interaction.deferReply();

    const { contentType, url } = interaction.options.getAttachment(filename);
    const sourceLanguage = TranslateLanguage.parse(interaction.options.getString(source));
    const targetLanguage = TranslateLanguage.parse(interaction.options.getString(target));
    const translator =
      translateApi[
        TranslateProvider.parse(
          interaction.options.getString(provider) || TranslateProvider.enum.google,
        )
      ];

    if (!contentType.includes("text/plain")) {
      throw new InvalidPayloadError("File must be .txt");
    }

    const response = await fetch(url);

    if (!response.body) throw new UnexpectedCommandError("Empty file");

    const file: string[] = [];
    const translateList: string[] = [];
    const translationLineInfo: { id: string; fileIndex: number; translateIndex: number }[] = [];
    const log: string[] = [];

    let fileLineIndex = 0;
    let translateIndex = 0;
    let totalTranslationCharCount = 0;
    for await (const line of readLinesFromStream(response.body)) {
      const lineToTranslatePattern =
        /* /^(?:Name|Tip|Ubertip|Researchtip|Researchubertip|Untip|Unubertip)=(.+)/; */
        /^(?:Name|Tip|Ubertip|Researchtip|Researchubertip|Untip|Unubertip)=(.+)/;
      const matchResult = line.trim().match(lineToTranslatePattern);
      log.push(`${!!matchResult}, ${isLanguageExists(line, sourceLanguage)}, ${line}`);
      if (!matchResult || !isLanguageExists(line, sourceLanguage)) {
        file.push(line);
        fileLineIndex++;
        continue;
      }

      const lineId = crypto.randomUUID();
      file.push(line.replace(matchResult[1], lineId));

      translateList.push(warcraftToHtml(matchResult[1]));
      translationLineInfo.push({
        id: lineId,
        fileIndex: fileLineIndex,
        translateIndex: translateIndex,
      });

      totalTranslationCharCount += translateList[translateIndex].length;
      translateIndex++;
      fileLineIndex++;
    }

    await writeFile("./log.txt", log.join("\n"), {
      encoding: "utf8",
    });
    await writeFile("./pre.txt", translateList.join("\n"), {
      encoding: "utf8",
    });
    await writeFile("./temp.txt", file.join("\n"), {
      encoding: "utf8",
    });
    const translationResult = await translator.translateHTMLStringList({
      list: translateList,
      source: sourceLanguage,
      target: targetLanguage,
    });
    await writeFile("./after.txt", translationResult.join("\n"), {
      encoding: "utf8",
    });

    for (const { id, fileIndex, translateIndex } of translationLineInfo) {
      file[fileIndex] = file[fileIndex].replace(
        id,
        htmlToWarcraft(translationResult[translateIndex]),
      );
    }

    await interaction.editReply({
      content: `${inlineCode(`Translation cost: ${translator.getTranslationCostInRUB(totalTranslationCharCount)}`)}
${inlineCode(`Total char count: ${totalTranslationCharCount}`)}`,
      files: [
        new AttachmentBuilder(Buffer.from(file.join("\n"), "utf-8"), {
          name: "CampaignAbilityStrings.txt",
        }),
      ],
    });
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

/** Convert all warcraft formation elements to html (color, new line)*/
const warcraftToHtml = (warcraftString: string): string =>
  warcraftString
    .replace(/\|C([A-Fa-f0-9]{8})/gi, ' <span color="$1"> ')
    .replace(/\|r/g, "</span>")
    .replace(/\|n/g, "\n")
    /** This symbol used to divide text to parts and not show all info simultaneously */
    .replace(/,/g, "<br>")
    /** With uppercase "X" translator might delete numbers */
    .replace(/X(\d+(?:\.\d+)?)/g, " x$1 ");

/** Convert some html and other keywords to warcraft formation elements (color, new line) */
const htmlToWarcraft = (htmlString: string): string =>
  htmlString
    .replace(/(?: *?)<span color="([0-9a-fA-F]{8})">(?: *)?/g, "|c$1")
    .replace(/<\/span>/g, "|r")
    .replace(/\n/g, "|n")
    /** Using chinese because default "," used to special cases */
    .replace(/,/g, "，")
    .replace(/<br>/g, ",")
    .replace(/ {2,}/g, " ");

const languageDetectionRegex: Record<TranslateLanguage, RegExp> = {
  [TranslateLanguage.enum.ko]: /\p{Script=Hangul}/u,
  [TranslateLanguage.enum.zh]: /[\u4E00-\u9FFF]/gu,
  [TranslateLanguage.enum.en]: /[A-Za-z]/u,
  [TranslateLanguage.enum.ru]: /\p{sc=Cyrillic}/u,
};
const isLanguageExists = (text: string, language: TranslateLanguage): boolean =>
  languageDetectionRegex[language].test(text);
