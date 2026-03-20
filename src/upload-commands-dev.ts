import { updateCommands } from "./utils/update-commands.ts";

try {
  await updateCommands();
} catch (error) {
  console.log("Failed to upload commands", error);
}
