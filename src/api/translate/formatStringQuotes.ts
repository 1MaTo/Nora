export const formatStringQuotes = (str: string) => {
  return str
    .replace(/[“”]/gm, `"`)
    .replace(/([^"]*"[^"]*)"/gm, "$1」")
    .replace(/"/gm, "「");
};
