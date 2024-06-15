import { BaseRange, Descendant, Element, NodeEntry, Text } from "slate";
import { IncorrectRange } from ".";
import { Suggestion } from "./Grammar.types";

export const addTextPathProperty = (
  nodes: Descendant[],
  parentPath: number[] = []
) => {
  return nodes.map((node, index) => {
    const currentPath = [...parentPath, index];
    const newNode = { ...node };

    if (Text.isText(newNode)) {
      newNode.path = currentPath;
    }

    if (Element.isElement(newNode) && Element.isElement(node)) {
      newNode.children = addTextPathProperty(node.children, currentPath);
    }

    return newNode;
  });
};

const combineIncorrectRanges = (ranges: IncorrectRange[]) => {
  if (ranges.length === 1) return ranges;

  const combinedRanges: IncorrectRange[] = [];

  for (let i = 0; i < ranges.length; i++) {
    const currentRange = ranges[i];
    const nextRange = ranges[i + 1];

    if (!nextRange) {
      combinedRanges.push(ranges[i]);
      continue;
    }

    const isCombined = nextRange.start - currentRange.end === 2;

    if (!isCombined) {
      combinedRanges.push(ranges[i]);
      continue;
    }

    combinedRanges.push({
      start: currentRange.start,
      end: nextRange.end,
    });

    i++;
  }

  return combinedRanges;
};

const getIncorrectRanges = (main: string, incorrects: string[]) => {
  const ranges: IncorrectRange[] = [];

  incorrects.forEach((incorrect) => {
    let startIndex = 0;

    while ((startIndex = main.indexOf(incorrect, startIndex)) !== -1) {
      const endIndex = startIndex + incorrect.length - 1;
      ranges.push({ start: startIndex, end: endIndex });
      startIndex += incorrect.length;
    }
  });

  return combineIncorrectRanges(ranges);
};

export const highlightSuggestedWords = (
  [node, path]: NodeEntry,
  suggestions: Suggestion[]
) => {
  const ranges: BaseRange[] = [];

  if (suggestions.length && Text.isText(node)) {
    const { text } = node;

    suggestions.forEach(({ text: suggestionText, path: suggestionPath }) => {
      const isSamePath =
        JSON.stringify(path) === JSON.stringify(suggestionPath);

      if (!isSamePath) return;

      const textParts = text.split(" ");
      const suggestionTextParts = new Set(suggestionText.split(" "));

      const incorrectParts = textParts.filter(
        (part) => !suggestionTextParts.has(part)
      );

      const incorrectRanges = getIncorrectRanges(text, incorrectParts);

      incorrectRanges.forEach((range) => {
        ranges.push({
          anchor: { path, offset: range.start },
          focus: { path, offset: range.end + 1 },
          highlight: true,
        });
      });
    });
  }

  return ranges;
};
