import { BaseText, Descendant, Node } from "slate";
import { ReactEditor } from "slate-react";

export interface HighlightSuggestionsParams {
  editor: ReactEditor;
  currentNode: Descendant[] | Descendant;
  suggestionNode: Descendant[] | Descendant;
}

export interface HighlightTextParams {
  editor: ReactEditor;
  currentNode: BaseText;
  suggestionNode: Node;
}
