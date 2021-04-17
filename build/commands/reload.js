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
const reload_1 = require("../commandsObjects/reload");
const botStatus_1 = require("../utils/botStatus");
const globals_1 = require("../utils/globals");
const reloadBot_1 = require("../utils/reloadBot");
class reload extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, reload_1.reloadCommand);
        // Not required initially, but required for reloading with a fresh file.
        this.filePath = __filename;
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ctx.member.id !== globals_1.ownerID)
                return;
            yield botStatus_1.changeBotStatus("🔄 Reboot 🔄");
            reloadBot_1.reloadBot(ctx.options["update"]);
            return;
        });
    }
}
exports.default = reload;
