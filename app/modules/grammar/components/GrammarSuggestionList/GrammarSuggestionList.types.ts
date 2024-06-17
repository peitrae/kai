import { HTMLAttributes } from "react";
import { Path } from "slate";

import { SuggestionItemContent } from "../GrammarSuggestionItemDesc";

export interface SuggestionItem {
  id: string;
  path: Path;
  incorrectText: string;
  suggestionContent: SuggestionItemContent;
}

export interface GrammarSuggestionListProps
  extends HTMLAttributes<HTMLDivElement> {
  list: SuggestionItem[];
}
