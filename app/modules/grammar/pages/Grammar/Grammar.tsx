"use client";

import { useEffect, useState } from "react";
import { Descendant, Transforms, createEditor } from "slate";
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
import findIndexRanges from "~/utils/findIndexRange";
import { addTextIdentifier, highlightSuggestions } from "./Grammar.utils";
import {
  GrammarContext,
  HighlightedItem,
  OnApplySuggestionParams,
  OnRemoveHighlightParams,
} from ".";

import styles from "./Grammar.module.sass";

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
  const [submitted, setSubmitted] = useState(false);

  const parseSuggestion = (
    suggestion: Suggestion,
    highligted: HighlightedItem
  ) => {
    const { parentText, incorrectText, suggestedText, range } = highligted;

    const incorrectRange = findIndexRanges(parentText, incorrectText);
    const [from, to] = incorrectRange[0] as number[];

    return {
      id: suggestion.id,
      range,
      content: {
        incorrectText,
        correctLeft: parentText.substring(0, from),
        correctRight: parentText.substring(to + 1),
        suggestedText,
      },
    };
  };

  useEffect(() => {
    const suggestions = fetcher.data;

    if (!suggestions) return;

    const highlighted = highlightSuggestions(editor, suggestions);

    const list = highlighted.map((item, i) =>
      parseSuggestion(suggestions[i], item)
    );
    setSuggestionList(list);
  }, [fetcher.data]);

  const onEditorChange = debounce((value: Descendant[]) => {
    if (submitted) return;

    const body = addTextIdentifier({ editor, nodes: value });

    fetcher.submit(JSON.stringify(body), {
      method: "post",
      encType: "application/json",
    });

    setSubmitted(true);
  }, 500);

  const onApplySuggestion = ({
    id,
    suggestedText,
    range,
  }: OnApplySuggestionParams) => {
    editor.insertText(suggestedText, { at: range });
    onRemoveHighlight({ id, range });
  };

  const onRemoveHighlight = ({ id, range }: OnRemoveHighlightParams) => {
    const currentSelection = editor.selection ? { ...editor.selection } : null;

    editor.select(range);
    editor.removeMark("highlight");

    if (currentSelection) Transforms.select(editor, currentSelection);

    setSuggestionList((list) => list.filter((item) => item.id !== id));
  };

  return (
    <main className={classNames("page", styles.grammar)}>
      <GrammarContext.Provider value={{ onApplySuggestion, onRemoveHighlight }}>
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
      </GrammarContext.Provider>
    </main>
  );
};

export default Grammar;
