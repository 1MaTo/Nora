"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const slash_create_1 = require("slash-create");
const mapconfig_1 = require("../commandsObjects/mapconfig");
const mapconfig_2 = require("../embeds/mapconfig");
const response_1 = require("../embeds/response");
const discordMessage_1 = require("../utils/discordMessage");
const globals_1 = require("../utils/globals");
const mapConfig_1 = require("../utils/mapConfig");
class mapconfig extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, mapconfig_1.mapconfigCommand);
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!globals_1.production && ctx.member.id !== globals_1.ownerID)
                return;
            if (ctx.options["create"]) {
                const slotMap = parseToSlotMap(ctx.options["create"]["teams"]);
                const maxSlotsInSlotMap = slotMap && slotMap.reduce((summ, curr) => (summ += curr.slots), 0);
                if (!slotMap || maxSlotsInSlotMap !== ctx.options["create"]["slots"]) {
                    yield discordMessage_1.sendResponse(ctx.channelID, { embed: response_1.error("Bad team values") }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                const isNew = yield mapConfig_1.createOrUpdateMapConfig(ctx.guildID, {
                    guildID: ctx.guildID,
                    name: ctx.options["create"]["name"],
                    slotMap,
                    slots: maxSlotsInSlotMap,
                });
                if (isNew) {
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.success("New config created"),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.success("Config was updated"),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            if (ctx.options["update"]) {
                if (ctx.options["update"]["spectators"]) {
                    const cfgName = ctx.options["update"]["spectators"]["name"];
                    const status = ctx.options["update"]["spectators"]["status"];
                    const changed = yield mapConfig_1.updateMapConfigOptions(ctx.guildID, cfgName, {
                        fieldName: "spectatorLivesMatter",
                        value: status,
                    });
                    if (!changed) {
                        yield discordMessage_1.sendResponse(ctx.channelID, {
                            embed: response_1.warning(`Can't find ${cfgName}`),
                        }, globals_1.msgDeleteTimeout.default);
                        return;
                    }
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.success(`Spectators for ${cfgName} now \`${status}\``),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                if (ctx.options["update"]["ranking"]) {
                    const cfgName = ctx.options["update"]["ranking"]["name"];
                    const status = ctx.options["update"]["ranking"]["status"];
                    const changed = yield mapConfig_1.updateMapConfigOptions(ctx.guildID, cfgName, {
                        fieldName: "ranking",
                        value: status,
                    });
                    if (!changed) {
                        yield discordMessage_1.sendResponse(ctx.channelID, {
                            embed: response_1.warning(`Can't find ${cfgName}`),
                        }, globals_1.msgDeleteTimeout.default);
                        return;
                    }
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.success(`Ranking for ${cfgName} now ${status}`),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                if (ctx.options["update"]["image"]) {
                    const cfgName = ctx.options["update"]["image"]["name"];
                    const link = ctx.options["update"]["image"]["link"];
                    const changed = yield mapConfig_1.updateMapConfigOptions(ctx.guildID, cfgName, {
                        fieldName: "mapImage",
                        value: link,
                    });
                    if (!changed) {
                        yield discordMessage_1.sendResponse(ctx.channelID, {
                            embed: response_1.warning(`Can't find ${cfgName}`),
                        }, globals_1.msgDeleteTimeout.default);
                        return;
                    }
                    if (link) {
                        yield discordMessage_1.sendResponse(ctx.channelID, {
                            embed: Object.assign(Object.assign({}, response_1.success(`Image for ${cfgName} set`)), { thumbnail: {
                                    url: link,
                                } }),
                        }, globals_1.msgDeleteTimeout.default);
                        return;
                    }
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.success(`Image for ${cfgName} deleted`),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
            }
            if (ctx.options["show"]) {
                const cfgName = ctx.options["show"]["name"];
                if (cfgName) {
                    const cfg = yield mapConfig_1.searchMapConfigByName(cfgName, ctx.guildID);
                    if (cfg) {
                        yield discordMessage_1.sendResponse(ctx.channelID, { embed: mapconfig_2.mapConfigInfo(cfg) }, globals_1.msgDeleteTimeout.long);
                        return;
                    }
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.warning(`Can't find ${cfgName}`),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                const configs = yield mapConfig_1.getGuildMapConfigs(ctx.guildID);
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: mapconfig_2.mapConfigList(configs.map((cfg) => cfg.name)),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            if (ctx.options["delete"]) {
                const cfgName = ctx.options["delete"]["name"];
                const deleted = yield mapConfig_1.deleteMapConfig(ctx.guildID, cfgName);
                if (deleted) {
                    yield discordMessage_1.sendResponse(ctx.channelID, {
                        embed: response_1.success(`${cfgName} deleted`),
                    }, globals_1.msgDeleteTimeout.default);
                    return;
                }
                yield discordMessage_1.sendResponse(ctx.channelID, {
                    embed: response_1.warning(`Can't find ${cfgName}`),
                }, globals_1.msgDeleteTimeout.default);
                return;
            }
            return;
        });
    }
}
exports.default = mapconfig;
const parseToSlotMap = (raw) => {
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
        }, []);
        return slotMap;
    }
    catch (error) {
        return null;
    }
};
