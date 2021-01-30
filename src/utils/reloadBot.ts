export const reloadBot = (withUpdates: boolean) => {
  let child_process = require("child_process");
  if (withUpdates)
    return child_process.execSync("npm run production_bot_restart");
  return child_process.execSync("npm run production_bot_restart_with_updates");
};
