type Generate = (min?: number, max?: number) => number;

export const generateNumber: Generate = (min = 0, max = 10) =>
  Math.floor(Math.random() * (max - min + min)) + min;
