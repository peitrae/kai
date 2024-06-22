const findIndexRanges = (text: string, char: string) => {
  const indexRanges: (number[] | -1)[] = [];

  const startIndex = text.indexOf(char);
  if (startIndex !== -1) {
    const endIndex = startIndex + char.length - 1;
    indexRanges.push([startIndex, endIndex]);
  } else {
    indexRanges.push(-1);
  }

  return indexRanges;
};

export default findIndexRanges;
