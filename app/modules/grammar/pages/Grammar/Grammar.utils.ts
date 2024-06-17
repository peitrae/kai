import { Descendant, Editor, Element, Node, Text, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import { toggleMark } from "~/components/RichtextEditor/RichtextEditor.utils";
import findStringDifference from "~/utils/findStringDifference";
import findIndexRanges from "~/utils/findIndexRange";
import { Suggestion } from "../../controller";

import {
  AddTextIdentifierParams,
  HighlighTextParams,
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
    Transforms.select(editor, {
      anchor: { path: suggestion.path, offset: anchorOffset },
      focus: { path: suggestion.path, offset: focusOffset + 1 },
    });

    toggleMark(editor, "highlight");
    toggleMark(editor, "id", suggestion.id);

    Transforms.deselect(editor);
  } catch (e) {
    console.error(`Unable to highlight: "${suggestion.text}"`);
  }
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

  if (currentSelection) Transforms.select(editor, currentSelection);
};

export const highlightSuggestions = (
  editor: ReactEditor,
  suggestions: Suggestion[]
) => {
  for (let i = suggestions.length - 1; i >= 0; i--) {
    const suggestion = suggestions[i];
    const hasPath = editor.hasPath(suggestion.path);

    if (!hasPath) return;

    const currentTextNode = Editor.node(editor, suggestion.path)[0];

    const currentText = Node.string(currentTextNode);
    const currentParts = currentText.split(" ");

    const suggestionText = Node.string(suggestion);
    const suggestionParts = suggestionText.split(" ");

    const [currentIncorrects] = findStringDifference(
      suggestionParts,
      currentParts
    );

    const incorrectRanges = findIndexRanges(currentText, currentIncorrects);

    highlightText({
      editor,
      suggestion,
      ranges: incorrectRanges,
    });
  }
};
