import { Path, Range } from "slate";

export interface BaseHighlighted {
  id: string;
  suggestedText: string;
  incorrectText: string;
}

export interface Highlighted extends BaseHighlighted {
  path: Path;
}

export interface HighlightedNewRange extends BaseHighlighted {
  parentText: string;
  range: Range;
}

export interface GrammarContextValue {
  onApplySuggestion: (params: OnApplySuggestionParams) => void;
  onRemoveHighlight: (params: OnRemoveHighlightParams) => void;
}

export interface OnRemoveHighlightParams {
  id: string;
  range: Range;
}

export interface OnApplySuggestionParams extends OnRemoveHighlightParams {
  suggestedText: string;
}
