import { useEffect, useState } from "react";
import { Descendant, createEditor } from "slate";
import { useFetcher } from "@remix-run/react";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import classNames from "classnames";

import debounce from "~/utils/debounce";
import { RichtextEditor, withHtml } from "~/components/RichtextEditor";
import { GrammarSuggestionList } from "../../components/GrammarSuggestionList";
import { GrammarController } from "../../controller";

import styles from "./Grammar.module.sass";
import { addTextIdentifier, highlightSuggestions } from "./Grammar.utils";
import { SuggestionItem } from ".";

export async function action() {
  const grammar = new GrammarController();
  return grammar.getSuggestions();
}

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
  const fetcher = useFetcher<SuggestionItem[]>();
  const [editor] = useState(() =>
    withHtml(withReact(withHistory(createEditor())))
  );

  useEffect(() => {
    if (!fetcher.data) return;

    highlightSuggestions(editor, fetcher.data);
  }, [fetcher.data]);

  const onEditorChange = debounce((value: Descendant[]) => {
    const body = addTextIdentifier({ editor, nodes: value });

    fetcher.submit(JSON.stringify(body), {
      method: "post",
      encType: "application/json",
    });
  }, 500);

  return (
    <main className={classNames("page", styles.grammar)}>
      <RichtextEditor
        editor={editor}
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
