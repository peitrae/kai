import { useCallback, useState } from "react";
import classNames from "classnames";

import debounce from "~/utils/debounce";
import {
  RichtextEditor,
  OnChangeRichtextEditorParams,
} from "~/components/RichtextEditor";

import styles from "./Grammar.module.sass";
import { highlightSuggestions } from "./Grammar.utils";
import { SuggestionItem } from "./Grammar.types";
import { ReactEditor } from "slate-react";

export const correctValue: SuggestionItem[] = [
  {
    text: "She doesn't like apples.",
    path: [0, 0],
  },
  { text: "Him and me ", path: [2, 0] },
  { text: " to the store.", path: [2, 2] },
];

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "She don't like apples.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "The book on the table is mine",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Him and I ",
        bold: true,
      },
      {
        text: "went",
        italic: true,
      },
      {
        text: " to the stare.",
      },
    ],
  },
];

const Grammar = () => {
  const [suggestions] = useState<SuggestionItem[]>(correctValue);

  const highlightSuggestionsCallback = useCallback(
    (editor: ReactEditor) => highlightSuggestions(editor, suggestions),
    [suggestions]
  );

  const onEditorChange = debounce(
    ({ editor }: OnChangeRichtextEditorParams) => {
      highlightSuggestionsCallback(editor);
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
