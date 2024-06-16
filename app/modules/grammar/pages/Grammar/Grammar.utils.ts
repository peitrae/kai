import { Editor, Node, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import { toggleMark } from "~/components/RichtextEditor/RichtextEditor.utils";
import findStringDifference from "~/utils/findStringDifference";

import { SuggestionItem } from "./Grammar.types";

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

const getSuggestedRanges = (current: string, suggestion: string) => {
  const currentPart = current.split(" ");
  const suggestionPart = suggestion.split(" ");

  const currentIncorrects = findStringDifference(suggestionPart, currentPart);

  const ranges = findIndexRanges(current, currentIncorrects);

  return ranges;
};

const highlightText = (editor: ReactEditor, suggestion: SuggestionItem) => {
  const currentNode = Editor.node(editor, suggestion.path)[0];

  const suggestionText = Node.string(suggestion);
  const currentText = Node.string(currentNode);
  const suggestedRanges = getSuggestedRanges(currentText, suggestionText);

  suggestedRanges.reverse().forEach((ranges) => {
    if (ranges === -1) return;

    const [anchorOffset, focusOffset] = ranges;

    try {
      const currentPath = ReactEditor.findPath(editor, currentNode);

      Transforms.select(editor, {
        anchor: { path: currentPath, offset: anchorOffset },
        focus: { path: currentPath, offset: focusOffset + 1 },
      });

      toggleMark(editor, "highlight");

      Transforms.deselect(editor);
    } catch (e) {
      console.error(`Unable to highlight: "${currentText}"`);
      return;
    }
  });
};

export const highlightSuggestions = (
  editor: ReactEditor,
  suggestions: SuggestionItem[]
) => {
  for (let i = suggestions.length - 1; i >= 0; i--) {
    const hasPath = editor.hasPath(suggestions[i].path);

    if (!hasPath) return;

    highlightText(editor, suggestions[i]);
  }
};
