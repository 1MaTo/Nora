export const formatStringSymbols = (str: string) => {
  return str
    .replace(/, */gm, "，")
    .replace(/\. */gm, "。")
    .replace(/: */gm, "：")

    .replace(/\) */gm, "）")
    .replace(/ *\(/gm, "（")

    .replace(/ *\[/gm, "【")
    .replace(/\] */gm, "】")
    .replace(/ *【/gm, "【")
    .replace(/】 */gm, "】");
};
