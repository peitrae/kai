import { Range } from "slate";

import { SuggestionContent } from "../GrammarSuggestionItemDesc";

export interface GrammarSuggestionItemProps {
  id: string;
  range: Range;
  content: SuggestionContent;
}

export interface GrammarSuggestionItemActionsProps {
  onApply: () => void;
  onIgnore: () => void;
}
