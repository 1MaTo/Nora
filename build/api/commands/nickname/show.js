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
exports.show = void 0;
const response_1 = require("../../../embeds/response");
const kies_1 = require("../../../redis/kies");
const redis_1 = require("../../../redis/redis");
const discordMessage_1 = require("../../../utils/discordMessage");
const globals_1 = require("../../../utils/globals");
const show = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const key = kies_1.redisKey.struct(kies_1.groupsKey.bindNickname, [
        interaction.guildId,
        interaction.user.id,
    ]);
    const userData = (yield redis_1.redis.get(key));
    if (!userData) {
        yield (0, discordMessage_1.editReply)(interaction, {
            embeds: [(0, response_1.warning)("Nickname not binded")],
        }, globals_1.msgDeleteTimeout.default);
        return;
    }
    yield (0, discordMessage_1.editReply)(interaction, {
        embeds: [
            (0, response_1.body)(userData.nickname, `${Object.entries(userData.settings)
                .map((field) => `[${field[0]}]: \`${field[1]}\``)
                .join("\n")}`),
        ],
    }, globals_1.msgDeleteTimeout.default);
});
exports.show = show;
