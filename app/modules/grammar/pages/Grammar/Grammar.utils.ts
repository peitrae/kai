import { BaseText, Editor, Element, Node, Text, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import { toggleMark } from "~/components/RichtextEditor/RichtextEditor.utils";
import findStringDifference from "~/utils/findStringDifference";
import {
  AddTextIdentifierParams,
  SuggestionItem,
  ToggleMarkHighlightParams,
} from ".";

export const addTextIdentifier = ({
  editor,
  nodes,
  parentPath = [],
}: AddTextIdentifierParams) => {
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

const findIndexRanges = (text: string, chars: string[]) => {
  const indexRanges: (number[] | -1)[] = [];

  chars.forEach((char) => {
    const startIndex = text.indexOf(char);
    if (startIndex !== -1) {
      const endIndex = startIndex + char.length - 1;
      indexRanges.push([startIndex, endIndex]);
    } else {
      indexRanges.push(-1);
    }
  });

  return indexRanges;
};

const toggleMarkHighlight = ({
  editor,
  currentTextNode,
  suggestion,
  suggestionRange,
}: ToggleMarkHighlightParams) => {
  const [anchorOffset, focusOffset] = suggestionRange;

  try {
    const currentPath = ReactEditor.findPath(editor, currentTextNode);

    Transforms.select(editor, {
      anchor: { path: currentPath, offset: anchorOffset },
      focus: { path: currentPath, offset: focusOffset + 1 },
    });

    toggleMark(editor, "highlight");
    toggleMark(editor, "id", suggestion.id);

    Transforms.deselect(editor);
  } catch (e) {
    const currentText = Node.string(currentTextNode);
    console.error(`Unable to highlight: "${currentText}"`);
  }
};

const getSuggestionRanges = (
  currentTextNode: BaseText,
  suggestionTextNode: BaseText
) => {
  const currentText = Node.string(currentTextNode);
  const currentParts = currentText.split(" ");

  const suggestionText = Node.string(suggestionTextNode);
  const suggestionParts = suggestionText.split(" ");

  const currentIncorrects = findStringDifference(suggestionParts, currentParts);
  const suggestedRanges = findIndexRanges(currentText, currentIncorrects);

  return suggestedRanges;
};

export const highlightSuggestions = (
  editor: ReactEditor,
  suggestions: SuggestionItem[]
) => {
  for (let i = suggestions.length - 1; i >= 0; i--) {
    const hasPath = editor.hasPath(suggestions[i].path);

    if (!hasPath) return;

    const currentSelection = editor.selection ? { ...editor.selection } : null;

    const currentTextNode = Editor.node(
      editor,
      suggestions[i].path
    )[0] as BaseText;

    const suggestionRanges = getSuggestionRanges(
      currentTextNode,
      suggestions[i]
    );

    suggestionRanges.reverse().forEach((range) => {
      if (range === -1) return;

      toggleMarkHighlight({
        editor,
        currentTextNode,
        suggestion: suggestions[i],
        suggestionRange: range,
      });
    });

    if (currentSelection) Transforms.select(editor, currentSelection);
  }
};
