// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = (cb: (args?: any) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (args: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      cb(args);
    }, delay);
  };
};

export default debounce;
