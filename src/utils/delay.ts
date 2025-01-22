export const delayCallback = (cb: () => void, delay: number) =>
  setTimeout(cb, delay);
