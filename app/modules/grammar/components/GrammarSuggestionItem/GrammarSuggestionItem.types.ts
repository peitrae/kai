import { HTMLAttributes } from "react";

import { SuggestionItem } from "../GrammarSuggestionList";

export interface GrammarSuggestionItemProps
  extends HTMLAttributes<HTMLLIElement> {
  data: SuggestionItem;
}

export interface GrammarSuggestionItemActionsProps {
  onApply: () => void;
  onIgnore: () => void;
}
