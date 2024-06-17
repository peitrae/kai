import { useEffect, useState } from "react";
import { Descendant, Editor, Node, createEditor } from "slate";
import { useFetcher } from "@remix-run/react";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import classNames from "classnames";

import debounce from "~/utils/debounce";
import { RichtextEditor, withHtml } from "~/components/RichtextEditor";
import {
  GrammarSuggestionList,
  SuggestionItem,
} from "../../components/GrammarSuggestionList";
import { GrammarController, Suggestion } from "../../controller";
import findStringDifference from "~/utils/findStringDifference";
import findIndexRanges from "~/utils/findIndexRange";

import styles from "./Grammar.module.sass";
import { addTextIdentifier, highlightSuggestions } from "./Grammar.utils";

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
  const fetcher = useFetcher<Suggestion[]>();
  const [suggestionList, setSuggestionList] = useState<SuggestionItem[]>([]);
  const [editor] = useState(() =>
    withHtml(withReact(withHistory(createEditor())))
  );

  const splitString = (current: string, at: number[]) => {
    const [from, to] = at;

    return [current.substring(0, from), current.substring(to + 1)];
  };

  const parseSuggestionItem = (suggestion: Suggestion): SuggestionItem => {
    const parentNode = Editor.parent(editor, suggestion.path)[0];
    const parentText = Node.string(parentNode);

    const currentNode = Editor.node(editor, suggestion.path)[0];
    const currentText = Node.string(currentNode);
    const currentParts = currentText.split(" ");

    const suggestionParts = suggestion.text.split(" ");

    const [incorrectText, suggestedText] = findStringDifference(
      suggestionParts,
      currentParts
    );

    const incorrectRange = findIndexRanges(parentText, incorrectText);

    const [correctLeft, correctRight] = splitString(
      parentText,
      incorrectRange[0] as number[]
    );

    const suggestionContent = {
      correctLeft,
      correctRight,
      incorrectText,
      suggestedText,
    };

    return {
      id: suggestion.id,
      path: suggestion.path,
      incorrectText,
      suggestionContent,
    };
  };

  useEffect(() => {
    const suggestions = fetcher.data;

    if (!suggestions) return;

    const list = suggestions.map(parseSuggestionItem);

    setSuggestionList(list);
    highlightSuggestions(editor, suggestions);
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
      <GrammarSuggestionList
        list={suggestionList}
        className={styles.grammarSuggestionList}
      />
    </main>
  );
};

export default Grammar;
