import { HTMLAttributes } from "react";
import { SuggestionMap } from "../../pages/Grammar";

export interface GrammarSuggestionListProps
  extends HTMLAttributes<HTMLDivElement> {
  activeId?: string;
  suggestionMap: SuggestionMap;
}
