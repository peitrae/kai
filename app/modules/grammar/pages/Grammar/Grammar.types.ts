import { BaseText, Path, Range } from "slate";
import { ReactEditor } from "slate-react";

export interface HighlightedText extends BaseText {
  highlight: boolean;
  id: string;
}

export interface GrammarEditor extends ReactEditor {
  isHighlightedText: (value: any) => value is HighlightedText;
}

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

export type SuggestionMap = Map<string, SuggestionMapValue>;

export interface SuggestionMapValue extends SuggestionContent {
  range: Range;
}

export interface SuggestionContent {
  correctLeft: string;
  correctRight: string;
  incorrectText: string;
  suggestedText: string;
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
