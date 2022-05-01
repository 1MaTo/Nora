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
exports.startGame = void 0;
const globals_1 = require("../../utils/globals");
const requestToGuiServer_1 = require("../../utils/requestToGuiServer");
const startGame = (force) => __awaiter(void 0, void 0, void 0, function* () {
    const marks = yield (0, requestToGuiServer_1.sendCommand)(`start ${force ? "force" : ""}`, 5000);
    if (!marks)
        return null;
    const commandResult = yield (0, requestToGuiServer_1.whaitForCommandResult)({
        startMark: marks[0],
        endMark: marks[1],
        successMark: globals_1.ghostCommandsMarks.start.success,
    });
    return commandResult;
});
exports.startGame = startGame;
