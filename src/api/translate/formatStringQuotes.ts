export const formatStringQuotes = (str: string) => {
  return str.replace(/([^"]*"[^"]*)"/gm, "$1」").replace(/"/gm, "「");
};
