import { production, withLogs } from "./globals";
import { addToReports } from "./reports";

export const log = (...message: any) => {
  addToReports(message);
  if (!production || withLogs) console.log(...message);
};
