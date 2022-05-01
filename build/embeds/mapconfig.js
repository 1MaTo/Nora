"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapConfigList = exports.mapConfigInfo = void 0;
const mapConfigInfo = (cfg) => {
    const image = cfg.options.mapImage && {
        thumbnail: {
            url: cfg.options.mapImage,
        },
    };
    return Object.assign({ title: `※ ${cfg.name}`, description: `**${cfg.slots}** slots`, color: null, fields: [
            {
                name: "※ Spectators",
                value: `\`${cfg.options.spectatorLivesMatter}\``,
            },
            {
                name: "※ Ranking",
                value: `\`${cfg.options.ranking}\``,
            },
            {
                name: "※ Group",
                value: cfg.slotMap.map((team) => team.name).join("\n"),
                inline: true,
            },
            {
                name: "※ Players",
                value: cfg.slotMap.map((team) => team.slots).join("\n"),
                inline: true,
            },
        ], author: {
            name: "Map config",
        } }, image);
};
exports.mapConfigInfo = mapConfigInfo;
const mapConfigList = (list) => {
    return {
        description: list.length ? list.join("\n") : "*No configs for this server*",
        color: null,
        author: {
            name: "※ Config list",
        },
    };
};
exports.mapConfigList = mapConfigList;
