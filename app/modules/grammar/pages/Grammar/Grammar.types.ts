import { BaseText, Descendant, Path } from "slate";
import { ReactEditor } from "slate-react";

export interface AddTextIdentifierParams {
  editor: ReactEditor;
  nodes: Descendant[];
  parentPath?: Path;
}

export interface SuggestionItem extends BaseText {
  path: Path;
}

export interface ToggleMarkHighlightParams {
  editor: ReactEditor;
  suggestion: SuggestionItem;
  suggestionRange: number[];
}

export interface HighlighTextParams {
  editor: ReactEditor;
  ranges: (number[] | -1)[];
  suggestion: SuggestionItem;
}
