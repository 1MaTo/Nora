import { CommandContext, SlashCommand } from "slash-create";
import { mapconfigCommand } from "../commandsObjects/mapconfig";
import { mapConfigInfo, mapConfigList } from "../embeds/mapconfig";
import { error, success, warning } from "../embeds/response";
import { sendResponse } from "../utils/discordMessage";
import { msgDeleteTimeout, ownerID, production } from "../utils/globals";
import {
  createOrUpdateMapConfig,
  deleteMapConfig,
  getGuildMapConfigs,
  searchMapConfigByName,
  updateMapConfigOptions,
} from "../utils/mapConfig";

export default class mapconfig extends SlashCommand {
  constructor(creator: any) {
    super(creator, mapconfigCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;

    if (ctx.options["create"]) {
      const slotMap = parseToSlotMap(ctx.options["create"]["teams"]);
      const maxSlotsInSlotMap =
        slotMap && slotMap.reduce((summ, curr) => (summ += curr.slots), 0);
      if (!slotMap || maxSlotsInSlotMap !== ctx.options["create"]["slots"]) {
        await sendResponse(
          ctx.channelID,
          { embed: error("Bad team values") },
          msgDeleteTimeout.default
        );
        return;
      }
      const isNew = await createOrUpdateMapConfig(ctx.guildID, {
        guildID: ctx.guildID,
        name: ctx.options["create"]["name"],
        slotMap,
        slots: maxSlotsInSlotMap,
      } as mapConfig);

      if (isNew) {
        await sendResponse(
          ctx.channelID,
          {
            embed: success("New config created"),
          },
          msgDeleteTimeout.default
        );
        return;
      }
      await sendResponse(
        ctx.channelID,
        {
          embed: success("Config was updated"),
        },
        msgDeleteTimeout.default
      );
      return;
    }

    if (ctx.options["update"]) {
      if (ctx.options["update"]["spectators"]) {
        const cfgName = ctx.options["update"]["spectators"]["name"];
        const status = ctx.options["update"]["spectators"]["status"];
        const changed = await updateMapConfigOptions(ctx.guildID, cfgName, {
          fieldName: "spectatorLivesMatter",
          value: status,
        });

        if (!changed) {
          await sendResponse(
            ctx.channelID,
            {
              embed: warning(`Can't find ${cfgName}`),
            },
            msgDeleteTimeout.default
          );
          return;
        }

        await sendResponse(
          ctx.channelID,
          {
            embed: success(`Spectators for ${cfgName} now \`${status}\``),
          },
          msgDeleteTimeout.default
        );
        return;
      }

      if (ctx.options["update"]["ranking"]) {
        const cfgName = ctx.options["update"]["ranking"]["name"];
        const status = ctx.options["update"]["ranking"]["status"];
        const changed = await updateMapConfigOptions(ctx.guildID, cfgName, {
          fieldName: "ranking",
          value: status,
        });

        if (!changed) {
          await sendResponse(
            ctx.channelID,
            {
              embed: warning(`Can't find ${cfgName}`),
            },
            msgDeleteTimeout.default
          );
          return;
        }

        await sendResponse(
          ctx.channelID,
          {
            embed: success(`Ranking for ${cfgName} now ${status}`),
          },
          msgDeleteTimeout.default
        );
        return;
      }

      if (ctx.options["update"]["image"]) {
        const cfgName = ctx.options["update"]["image"]["name"];
        const link = ctx.options["update"]["image"]["link"];

        const changed = await updateMapConfigOptions(ctx.guildID, cfgName, {
          fieldName: "mapImage",
          value: link,
        });

        if (!changed) {
          await sendResponse(
            ctx.channelID,
            {
              embed: warning(`Can't find ${cfgName}`),
            },
            msgDeleteTimeout.default
          );
          return;
        }

        if (link) {
          await sendResponse(
            ctx.channelID,
            {
              embed: {
                ...success(`Image for ${cfgName} set`),
                thumbnail: {
                  url: link,
                },
              },
            },
            msgDeleteTimeout.default
          );

          return;
        }

        await sendResponse(
          ctx.channelID,
          {
            embed: success(`Image for ${cfgName} deleted`),
          },
          msgDeleteTimeout.default
        );
        return;
      }
    }

    if (ctx.options["show"]) {
      const cfgName = ctx.options["show"]["name"];
      if (cfgName) {
        const cfg = await searchMapConfigByName(cfgName, ctx.guildID);
        if (cfg) {
          await sendResponse(
            ctx.channelID,
            { embed: mapConfigInfo(cfg) },
            msgDeleteTimeout.long
          );
          return;
        }
        await sendResponse(
          ctx.channelID,
          {
            embed: warning(`Can't find ${cfgName}`),
          },
          msgDeleteTimeout.default
        );
        return;
      }
      const configs = await getGuildMapConfigs(ctx.guildID);
      await sendResponse(
        ctx.channelID,
        {
          embed: mapConfigList(configs.map((cfg) => cfg.name)),
        },
        msgDeleteTimeout.default
      );
      return;
    }

    if (ctx.options["delete"]) {
      const cfgName = ctx.options["delete"]["name"];
      const deleted = await deleteMapConfig(ctx.guildID, cfgName);
      if (deleted) {
        await sendResponse(
          ctx.channelID,
          {
            embed: success(`${cfgName} deleted`),
          },
          msgDeleteTimeout.default
        );
        return;
      }
      await sendResponse(
        ctx.channelID,
        {
          embed: warning(`Can't find ${cfgName}`),
        },
        msgDeleteTimeout.default
      );
      return;
    }

    return;
  }
}

const parseToSlotMap = (raw: string): Array<mapConfigSlotMap> => {
  try {
    const slotMap = raw.split("|").reduce((teams, raw) => {
      const team = raw.split(",");
      if (isNaN(+team[1]) || +team[1] <= 0)
        throw new Error("Bad team slots value");
      return [
        ...teams,
        {
          name: team[0].trim(),
          slots: +team[1],
        },
      ];
    }, [] as Array<mapConfigSlotMap>);
    return slotMap;
  } catch (error) {
    return null;
  }
};
