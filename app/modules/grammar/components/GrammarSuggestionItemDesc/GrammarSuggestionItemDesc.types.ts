export interface SuggestionItemContent {
  correctLeft: string;
  correctRight: string;
  incorrectText: string;
  suggestedText: string;
}

export interface GrammarSuggestionDescProps {
  content: SuggestionItemContent;
}
