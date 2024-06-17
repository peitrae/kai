import { HTMLAttributes } from "react";

export interface GrammarSuggestionItemProps
  extends HTMLAttributes<HTMLLIElement> {}

export interface GrammarSuggestionItemActionsProps {
  onApply: () => void;
  onIgnore: () => void;
}
