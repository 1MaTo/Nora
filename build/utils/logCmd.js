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
exports.logButtonCommand = exports.logCommand = void 0;
const builders_1 = require("@discordjs/builders");
const kies_1 = require("../redis/kies");
const redis_1 = require("../redis/redis");
const globals_1 = require("./globals");
const log_1 = require("./log");
const getOptionsNames = (options) => {
    return options.reduce((prev, option) => {
        if (option.options) {
            return [...prev, option.name, ...getOptionsNames(option.options)];
        }
        return [...prev, option.name];
    }, []);
};
const logCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (interaction.commandName === "logs")
            return;
        const key = kies_1.redisKey.struct(kies_1.groupsKey.commandLog, [interaction.guildId]);
        const logs = (yield redis_1.redis.get(key)) || [];
        if (logs.length > globals_1.commandLogsMaxCount) {
            logs.shift();
        }
        const log = `${(0, builders_1.time)(new Date())} ${(0, builders_1.bold)(interaction.user.tag)}\n${(0, builders_1.inlineCode)([
            interaction.commandName,
            ...getOptionsNames(interaction.options.data),
        ].join(" -> "))}`;
        yield redis_1.redis.set(key, [...logs, log]);
    }
    catch (err) {
        (0, log_1.log)("[logCmd] error when logging", err);
    }
});
exports.logCommand = logCommand;
const logButtonCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = kies_1.redisKey.struct(kies_1.groupsKey.commandLog, [interaction.guildId]);
        const logs = (yield redis_1.redis.get(key)) || [];
        if (logs.length > globals_1.commandLogsMaxCount) {
            logs.shift();
        }
        const log = `${(0, builders_1.time)(new Date())} ${(0, builders_1.bold)(interaction.user.tag)}\n${(0, builders_1.inlineCode)(`button ${interaction.customId}`)}`;
        yield redis_1.redis.set(key, [...logs, log]);
    }
    catch (err) {
        (0, log_1.log)("[logCmd] error when logging", err);
    }
});
exports.logButtonCommand = logButtonCommand;
