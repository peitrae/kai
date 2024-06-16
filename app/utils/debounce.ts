// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T = unknown>(cb: (...args: T[]) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: T[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

export default debounce;
