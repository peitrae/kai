export interface SuggestionContent {
  correctLeft: string;
  correctRight: string;
  incorrectText: string;
  suggestedText: string;
}

export interface GrammarSuggestionDescProps {
  content: SuggestionContent;
}
