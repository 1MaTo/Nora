import { client } from "../bot";
import { ownerID } from "./globals";
import { log } from "./log";

export const report = async (message: string) => {
  try {
    const owner = await client.users.fetch(ownerID, { cache: false });
    owner.send(`**REPORT**\n\`\`\`${message}\`\`\``);
  } catch (error) {
    log("[REPORT TO USER ERROR] ----> ", error);
  }
};
