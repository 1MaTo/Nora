export const uniqueFromArray = (array: Array<any>) =>
  array.filter((v, i, a) => a.indexOf(v) === i);
