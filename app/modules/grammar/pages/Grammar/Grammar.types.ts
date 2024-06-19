import { Descendant, Path, Range } from "slate";
import { ReactEditor } from "slate-react";

import { Suggestion } from "../../controller";

export interface AddTextIdentifierParams {
  editor: ReactEditor;
  nodes: Descendant[];
  parentPath?: Path;
}

export interface ToggleMarkHighlightParams {
  editor: ReactEditor;
  suggestion: Suggestion;
  suggestionRange: number[];
}

export interface HighlighTextParams {
  editor: ReactEditor;
  ranges: (number[] | -1)[];
  suggestion: Suggestion;
}

export interface FindHighlightedNewRange {
  editor: ReactEditor;
  id: string;
  incorrectText: string;
  suggestedText: string;
  path: Path;
}

export interface HighlightedItem {
  id: string;
  suggestedText: string;
  incorrectText: string;
  parentText: string;
  range: Range;
}

export interface GrammarContextValue {
  onApplySuggestion: (params: OnApplySuggestionParams) => void;
}

export interface OnApplySuggestionParams {
  id: string;
  suggestedText: string;
  range: Range;
}
