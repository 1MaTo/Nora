import { production, withLogs } from "./globals";

export const log = (...message: any) => {
  if (!production || withLogs) console.log(...message);
};
