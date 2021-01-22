import { production } from "./globals";

export const log = (message: any) => {
  if (!production) console.log(message);
};
