import { BaseText, Descendant, Path } from "slate";
import { ReactEditor } from "slate-react";

export interface AddTextIdentifierParams {
  editor: ReactEditor;
  nodes: Descendant[];
  parentPath?: Path;
}

export interface SuggestionItem extends BaseText {
  path: Path;
}
