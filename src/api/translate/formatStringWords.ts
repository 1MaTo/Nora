export const formatStringWords = (str: string) => {
  return str
    .replace(/skill type/gim, "type")
    .replace(/cooling time/gim, "cd")
    .replace(/damage/gim, "dmg")
    .replace(/casting distance/gim, "range")
    .replace(/seconds/gim, "s");
};
