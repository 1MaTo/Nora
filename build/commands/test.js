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
const globals_1 = require("../utils/globals");
class test extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "test",
            description: "try me",
            guildID: globals_1.guildIDs.ghostGuild,
            throttling: { usages: 1, duration: 1 },
        });
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ctx.member.id !== globals_1.ownerID || globals_1.production)
                return;
            //const guild = await this.creator.api.getCommands("408947483763277825");
            //log(guild);
            //sendResponse(ctx.channelID, "Hey");
            //updateSlashCommand(guildIDs.ghostGuild, lobbyCommand);
            /* await deleteMapConfig(ctx.guildID, "fbt");
            await createOrUpdateMapConfig(ctx.guildID, {
              guildID: ctx.guildID,
              name: "fbt",
              slotMap: [
                { name: "Team 1", slots: 4 },
                { name: "Team 2", slots: 4 },
                { name: "Spectators", slots: 2 },
              ],
              options: undefined,
              slots: 10,
            });*/
            /* const configOne = await searchMapConfigByName("fbt", ctx.guildID);
            const configTwo = await searchMapConfigByMapName("FBT 169", ctx.guildID);
        
            log(configOne, configTwo); */
            //updateSlashCommand(guildIDs.ghostGuild, ghostCommand);
            //report("Hi im here and reloaded myself! NICE");
            /*   await Promise.all(
              usersIDs.map(async (id) => await sendResponse(ctx.channelID, `<@${id}>`))
            ); */
            /*     const keys = await redis.scanForPattern(
              `${groupsKey.bindNickname}${keyDivider}${ctx.guildID}*`
            );
        
            await Promise.all(
              keys.map(async (key) => {
                const old = await redis.get(key);
                await redis.set(key, {
                  nickname: old,
                  discordID: redisKey.destruct(key)[1],
                  settings: {},
                } as userData);
              })
            );
         */
            /*     const game = [
              {
                botid: 1,
                gamename: "fdf #1",
                owner: "replica",
                host: "replica",
                mapname: "FBT 169.1 FIX (127)",
                players: [
                  {
                    name: "IMaToI",
                    server: "string",
                    ping: "string",
                    winrate: "string",
                  },
                ] as lobbyTable[],
                slots: 10,
                slotsTaken: 1,
                mapImage: undefined,
              },
            ].find((game) => game.gamename == "[fdf #1]".replace(/[\[\]]/g, ""));
        
            log(game, "[fdf #1]");
            if (game) {
              pingUsersOnStart(game, ctx.guildID);
            } */
            //updateSlashCommand(ctx.guildID, statsCommand);
            //log([...games].map(([gameid, game]) => game));
            return;
        });
    }
}
exports.default = test;
