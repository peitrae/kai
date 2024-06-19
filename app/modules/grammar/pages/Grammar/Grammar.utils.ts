import { Descendant, Editor, Element, Node, Text, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import findStringDifference from "~/utils/findStringDifference";
import findIndexRanges from "~/utils/findIndexRange";
import { Suggestion } from "../../controller";

import {
  AddTextIdentifierParams,
  FindHighlightedNewRange,
  HighlighTextParams,
  HighlightedItem,
  ToggleMarkHighlightParams,
} from ".";

export const addTextIdentifier = ({
  editor,
  nodes,
  parentPath = [],
}: AddTextIdentifierParams): Descendant[] => {
  return nodes.map((node, index) => {
    const newNode = { ...node };
    const currentPath = [...parentPath, index];

    if (Text.isText(newNode)) {
      const key = ReactEditor.findKey(editor, node);
      newNode.path = currentPath;
      newNode.id = key.id;
    }

    if (Element.isElement(newNode) && Element.isElement(node)) {
      newNode.children = addTextIdentifier({
        editor,
        nodes: node.children,
        parentPath: currentPath,
      });
    }

    return newNode;
  });
};

const toggleMarkHighlight = ({
  editor,
  suggestion,
  suggestionRange,
}: ToggleMarkHighlightParams) => {
  const [anchorOffset, focusOffset] = suggestionRange;

  try {
    editor.select({
      anchor: { path: suggestion.path, offset: anchorOffset },
      focus: { path: suggestion.path, offset: focusOffset + 1 },
    });

    editor.addMark("highlight", true);
    editor.addMark("id", suggestion.id);

    editor.deselect();
  } catch (e) {
    console.error(`Unable to highlight: "${suggestion.text}"`);
  }
};

const findHighlightedNewRange = ({
  editor,
  path,
  ...highlighted
}: FindHighlightedNewRange): HighlightedItem => {
  // TODO: parentPath and path is possibly has the same value, improve it later
  const [parentNode, parentPath] = Editor.parent(editor, path);

  const childNewIndex = parentNode.children.findIndex((node) => {
    if (!Text.isText(node)) return;
    if (node.text !== highlighted.incorrectText) return;

    return true;
  });

  return {
    ...highlighted,
    parentText: Node.string(parentNode),
    range: {
      anchor: { path: [...parentPath, childNewIndex], offset: 0 },
      focus: {
        path: [...parentPath, childNewIndex],
        offset: highlighted.suggestedText.length,
      },
    },
  };
};

const highlightText = ({ editor, suggestion, ranges }: HighlighTextParams) => {
  const currentSelection = editor.selection ? { ...editor.selection } : null;

  ranges.reverse().forEach((range) => {
    if (range === -1) return;

    toggleMarkHighlight({
      editor,
      suggestion,
      suggestionRange: range,
    });
  });

  if (currentSelection) editor.select(currentSelection);
};

export const highlightSuggestions = (
  editor: ReactEditor,
  suggestions: Suggestion[]
) => {
  const highlighted = [];

  for (let i = suggestions.length - 1; i >= 0; i--) {
    const suggestion = suggestions[i];
    const hasPath = editor.hasPath(suggestion.path);

    if (!hasPath) continue;

    const currentTextNode = Node.get(editor, suggestion.path);
    const currentText = Node.string(currentTextNode);
    const currentParts = currentText.split(" ");

    const suggestionText = Node.string(suggestion);
    const suggestionParts = suggestionText.split(" ");

    const [incorrectText, suggestedText] = findStringDifference(
      suggestionParts,
      currentParts
    );

    if (!incorrectText) continue;

    const incorrectRanges = findIndexRanges(currentText, incorrectText);

    highlightText({
      editor,
      suggestion,
      ranges: incorrectRanges,
    });

    highlighted.push({
      id: suggestion.id,
      suggestedText,
      incorrectText,
      path: suggestion.path,
    });
  }

  const highlightedNewRange = highlighted
    .reverse()
    .map((item) => findHighlightedNewRange({ editor, ...item }));

  return highlightedNewRange;
};
