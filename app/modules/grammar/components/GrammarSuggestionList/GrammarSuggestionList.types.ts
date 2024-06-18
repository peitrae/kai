import { HTMLAttributes } from "react";
import { Range } from "slate";

import { SuggestionItemContent } from "../GrammarSuggestionItemDesc";

export interface SuggestionItem {
  id: string;
  range: Range;
  content: SuggestionItemContent;
}

export interface GrammarSuggestionListProps
  extends HTMLAttributes<HTMLDivElement> {
  list: SuggestionItem[];
}
