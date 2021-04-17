"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadBot = void 0;
const reloadBot = (withUpdates) => {
    let child_process = require("child_process");
    if (withUpdates)
        return child_process.execSync("npm run production_bot_restart_with_updates");
    return child_process.execSync("npm run production_bot_restart");
};
exports.reloadBot = reloadBot;
