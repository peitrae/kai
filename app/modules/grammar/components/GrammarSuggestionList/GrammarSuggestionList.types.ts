import { HTMLAttributes } from "react";
import { Range } from "slate";
import { SuggestionContent } from "../GrammarSuggestionItemDesc";

export interface SuggestionItem {
  id: string;
  range: Range;
  content: SuggestionContent;
}

export interface GrammarSuggestionListProps
  extends HTMLAttributes<HTMLDivElement> {
  list: SuggestionItem[];
}
