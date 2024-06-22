import { Range } from "slate";
import { SuggestionMapValue } from "../../pages/Grammar";

export interface GrammarSuggestionItemProps {
  id: string;
  data: SuggestionMapValue;
  isLoading?: boolean;
}

export interface GrammarSuggestionItemActionsProps {
  onApply: () => void;
  onIgnore: () => void;
  disabled?: boolean;
}
