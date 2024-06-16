import {
  BaseElement,
  BaseRange,
  BaseText,
  Descendant,
  Element,
  Node,
  NodeEntry,
  Path,
  Text,
} from "slate";
import { IncorrectRange } from ".";

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
      path: currentRange.path,
    });

    i++;
  }

  return combinedRanges;
};

const getIncorrectRanges = (
  contentTexts: string[],
  incorrectTexts: string[],
  path: Path
) => {
  const ranges: IncorrectRange[] = [];
  let incorrectPath = path;

  incorrectTexts.forEach((incorrect) => {
    contentTexts.forEach((text, idx) => {
      if (contentTexts.length !== 1) incorrectPath = [...path, idx];
      let startIndex = 0;

      while ((startIndex = text.indexOf(incorrect, startIndex)) !== -1) {
        const endIndex = startIndex + incorrect.length - 1;
        ranges.push({ start: startIndex, end: endIndex, path: incorrectPath });
        startIndex += incorrect.length;
      }
    });
  });

  return combineIncorrectRanges(ranges);
};

const getSuggestionNode = (
  suggestions: Descendant[],
  path: Path
): Descendant | undefined => {
  const [parentIndex, childIndex] = path;

  if (childIndex !== undefined) {
    const parentNode = suggestions[parentIndex] as BaseElement;
    return parentNode.children[childIndex];
  } else {
    return suggestions[parentIndex];
  }
};

export const highlightSuggestedWords = (
  [node, path]: NodeEntry,
  suggestions: Descendant[]
) => {
  const ranges: BaseRange[] = [];

  if (suggestions.length && Element.isElement(node)) {
    const suggestionNode = getSuggestionNode(suggestions, path);

    if (!suggestionNode || !Node.matches(node, suggestionNode)) return [];

    const suggestionText = Node.string(suggestionNode);
    const suggestionTextParts = new Set(suggestionText.split(" "));

    const contentTexts = node.children.map((item) => (item as BaseText).text);
    const contentTextParts = Node.string(node).split(" ");

    const incorrectParts = contentTextParts.filter(
      (part) => !suggestionTextParts.has(part)
    );

    const incorrectRanges = getIncorrectRanges(
      contentTexts,
      incorrectParts,
      path
    );

    incorrectRanges.forEach((range) => {
      ranges.push({
        anchor: { path: range.path, offset: range.start },
        focus: { path: range.path, offset: range.end + 1 },
        highlight: true,
      });
    });
  }

  return ranges;
};
