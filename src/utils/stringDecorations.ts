export const fillSpaces = (
  maxSymbols: number,
  str: string = "",
  symbolsCount: number = null,
  symbol: string = " "
) => {
  return `${str}${[
    ...Array(symbolsCount || Math.abs(maxSymbols - str.length)).keys(),
  ]
    .map((_) => symbol)
    .join("")}`;
};
