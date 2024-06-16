import { useCallback, useState } from "react";
import classNames from "classnames";

import debounce from "~/utils/debounce";
import {
  RichtextEditor,
  OnChangeRichtextEditorParams,
} from "~/components/RichtextEditor";

import styles from "./Grammar.module.sass";
import { addTextIdentifier, highlightSuggestions } from "./Grammar.utils";
import { ReactEditor } from "slate-react";
import { SuggestionItem } from ".";

export const correctValue: SuggestionItem[] = [];

const Grammar = () => {
  const [suggestions] = useState<SuggestionItem[]>(correctValue);

  const highlightSuggestionsCallback = useCallback(
    (editor: ReactEditor) => highlightSuggestions(editor, suggestions),
    [suggestions]
  );

  const onEditorChange = debounce(
    ({ editor, value }: OnChangeRichtextEditorParams) => {
      console.log(addTextIdentifier({ editor, nodes: value }));

      highlightSuggestionsCallback(editor);
    },
    500
  );

  return (
    <main className={classNames("page", styles.grammar)}>
      <RichtextEditor
        className={styles.grammarEditor}
        placeholder="Type or paste your text here"
        onValueChange={onEditorChange}
      />
    </main>
  );
};

export default Grammar;
