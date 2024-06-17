// Returns [correctIndex, givenIndex] if match found or [-1, -1] if no match found
const findIndexOfLongestMatchingWord = (
  corrects: string[],
  givens: string[]
) => {
  // Create an array of word length and its index for the correct word array
  const correctWordLengthIndexArray = corrects
    .map((word, index) => [word.length, index])
    .sort(([length1], [length2]) => length2 - length1);

  for (
    let matchingIndex = 0;
    matchingIndex < corrects.length;
    matchingIndex++
  ) {
    const correctArrayIndex = correctWordLengthIndexArray[matchingIndex][1];
    const correctArrayWord = corrects[correctArrayIndex];
    const foundIndexOfGivenWord = givens.findIndex(
      (givenWord) => givenWord === correctArrayWord
    );

    if (foundIndexOfGivenWord != -1)
      return [correctArrayIndex, foundIndexOfGivenWord];
  }

  return [-1, -1];
};

const findStringDifference = (
  corrects: string[],
  givens: string[]
): string[] => {
  // If either array empty there is nothing to compare, return each one formatted
  if (corrects.length == 0 || givens.length == 0) {
    return [];
  }

  const [correctIndex, givenIndex] = findIndexOfLongestMatchingWord(
    corrects,
    givens
  );

  if (correctIndex != -1) {
    // Split each string at their index and run find difference on each side of the indexes;
    const leftCorrect = corrects.slice(0, correctIndex);
    const rightCorrect = corrects.slice(correctIndex + 1);

    const leftGiven = givens.slice(0, givenIndex);
    const rightGiven = givens.slice(givenIndex + 1);

    return [
      ...findStringDifference(leftCorrect, leftGiven),
      ...findStringDifference(rightCorrect, rightGiven),
    ];
  } else {
    return [...givens, ...corrects];
  }
};

export default findStringDifference;
