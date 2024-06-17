import { Descendant, Path } from "slate";
import { ReactEditor } from "slate-react";

import { Suggestion } from "../../controller";

export interface AddTextIdentifierParams {
  editor: ReactEditor;
  nodes: Descendant[];
  parentPath?: Path;
}

export interface ToggleMarkHighlightParams {
  editor: ReactEditor;
  suggestion: Suggestion;
  suggestionRange: number[];
}

export interface HighlighTextParams {
  editor: ReactEditor;
  ranges: (number[] | -1)[];
  suggestion: Suggestion;
}
