import { useCallback, useState } from "react";
import classNames from "classnames";

import debounce from "~/utils/debounce";
import {
  RichtextEditor,
  OnChangeRichtextEditorParams,
} from "~/components/RichtextEditor";

import styles from "./Grammar.module.sass";
import { highlightSuggestions } from "./Grammar.utils";
import { HighlightSuggestionsParams } from ".";

export const correctValue = [
  {
    type: "paragraph",
    children: [{ text: "Sha dont like apples." }],
  },
  {
    type: "paragraph",
    children: [{ text: "The book on the table is mine" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Him and store are went to the stare." }],
  },
];

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "She don't like apples." }],
  },
  {
    type: "paragraph",
    children: [{ text: "The book on the table is mine" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Him and me went to the store." }],
  },
];

const Grammar = () => {
  const [suggestions] = useState(correctValue);

  const highlightSuggestionsCallback = useCallback(
    (params: HighlightSuggestionsParams) => highlightSuggestions(params),
    [suggestions]
  );
  const onEditorChange = debounce(
    ({ editor, value }: OnChangeRichtextEditorParams) => {
      highlightSuggestionsCallback({
        editor,
        currentNode: value,
        suggestionNode: suggestions,
      });
    },
    500
  );

  return (
    <main className={classNames("page", styles.grammar)}>
      <RichtextEditor
        className={styles.grammarEditor}
        placeholder="Type or paste your text here"
        initialValue={initialValue}
        onValueChange={onEditorChange}
      />
    </main>
  );
};

export default Grammar;
