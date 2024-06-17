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
import { GrammarSuggestionList } from "../../components/GrammarSuggestionList";

export const correctValue: SuggestionItem[] = [
  {
    text: "She doesn't like apples.",
    path: [0, 0],
    id: "3",
  },
  { text: "Him and me ", path: [2, 0], id: "5" },
  { text: " to the store.", path: [2, 2], id: "7" },
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
    (editor: ReactEditor, suggestions: SuggestionItem[]) =>
      highlightSuggestions(editor, suggestions),
    [suggestions]
  );

  const onEditorChange = debounce(
    ({ editor, value }: OnChangeRichtextEditorParams) => {
      console.log(addTextIdentifier({ editor, nodes: value }));

      highlightSuggestionsCallback(editor, suggestions);
    },
    500
  );

  return (
    <main className={classNames("page", styles.grammar)}>
      <RichtextEditor
        initialValue={initialValue}
        className={styles.grammarEditor}
        placeholder="Type or paste your text here"
        onValueChange={onEditorChange}
      />
      <GrammarSuggestionList className={styles.grammarSuggestionList} />
    </main>
  );
};

export default Grammar;
