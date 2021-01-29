import { CommandContext, SlashCommand } from "slash-create";
import { mapconfigCommand } from "../commandsObjects/mapconfig";
import { ownerID, production } from "../utils/globals";
import { log } from "../utils/log";

export default class test extends SlashCommand {
  constructor(creator: any) {
    super(creator, mapconfigCommand);

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!production && ctx.member.id !== ownerID) return;

    if (ctx.options["create"]) {
      const slotMap = parseToSlotMap(ctx.options["create"]["teams"]);
      const maxSlotsInSlotMap = slotMap.reduce(
        (summ, curr) => (summ += curr.slots),
        0
      );
      if (!slotMap || maxSlotsInSlotMap !== ctx.options["create"]["slots"]) {
        return log("bad teams value");
      }
    }

    log(ctx.options);
    return;
  }
}

export const parseToSlotMap = (raw: string): Array<mapConfigSlotMap> => {
  try {
    const slotMap = raw.split("|").reduce((teams, raw) => {
      const team = raw.split(",");
      if (isNaN(+team[1]) || +team[1] <= 0)
        throw new Error("Bad team slots value");
      return [
        ...teams,
        {
          name: team[0],
          slots: +team[1],
        },
      ];
    }, [] as Array<mapConfigSlotMap>);
    return slotMap;
  } catch (error) {
    return null;
  }
};
