"use client";

import { useEffect, useState } from "react";
import {
  Node,
  NodeEntry,
  Path,
  Range,
  Text,
  Transforms,
  createEditor,
} from "slate";
import { useFetcher } from "@remix-run/react";
import { ReactEditor, withReact } from "slate-react";
import { withHistory } from "slate-history";
import classNames from "classnames";

import { withHtml, getNodeTextParts } from "~/components/RichTextEditor";
import { GrammarSuggestionList } from "../../components/GrammarSuggestionList";
import { GrammarController, Suggestion } from "../../controller";
import findIndexRanges from "~/utils/findIndexRange";
import findStringDifference from "~/utils/findStringDifference";

import {
  GrammarContext,
  Highlighted,
  HighlightedNewRange,
  OnApplySuggestionParams,
  OnRemoveHighlightParams,
  SuggestionMap,
  GrammarEditor,
  HighlightedText,
} from ".";
import styles from "./Grammar.module.sass";
import { GrammarRichTextEditor } from "../../components/GrammarRichTextEditor";

export async function action() {
  const grammar = new GrammarController();
  return grammar.getSuggestions();
}

export const withGrammar = (editor: ReactEditor): GrammarEditor => {
  const e = editor as GrammarEditor;

  e.isHighlightedText = (element): element is HighlightedText => {
    return element.id && element.highlight && Text.isText(element);
  };

  return e;
};

const Grammar = () => {
  const fetcher = useFetcher<Suggestion[]>({ key: "grammar" });
  const [suggestionMap, setSuggestionMap] = useState<SuggestionMap>(new Map());
  const [expandSuggestionId, setExpandSuggestionId] = useState<
    string | undefined
  >(undefined);
  const [editor] = useState(() =>
    withGrammar(withHtml(withReact(withHistory(createEditor()))))
  );

  useEffect(
    () => fetcher.data && handleOnSuggestionsChange(fetcher.data),
    [fetcher.data]
  );

  const handleOnSuggestionsChange = (suggestions: Suggestion[]) => {
    const highlighted = highlightSuggestions(suggestions);

    const suggestionMap = new Map();
    highlighted.forEach((item, i) => {
      const { id, ...rest } = parseSuggestion(item, suggestions[i]);
      suggestionMap.set(id, rest);
    });

    setSuggestionMap(suggestionMap);
  };

  const highlightSuggestions = (suggestions: Suggestion[]) => {
    const highlighted = suggestions.reduceRight((acc, suggestion) => {
      if (!editor.hasPath(suggestion.path)) return acc;

      const currentNode = Node.get(editor, suggestion.path);
      const current = getNodeTextParts(currentNode);
      const suggested = getNodeTextParts(suggestion);

      const [incorrectText, suggestedText] = findStringDifference(
        suggested.parts,
        current.parts
      );

      if (!incorrectText) return acc;

      const incorrectIndexes = findIndexRanges(current.text, incorrectText);

      for (let j = incorrectIndexes.length - 1; j >= 0; j--) {
        const indexes = incorrectIndexes[j];

        if (indexes === -1) continue;
        const [anchorOffset, focusOffset] = indexes;

        const range = {
          anchor: { path: suggestion.path, offset: anchorOffset },
          focus: { path: suggestion.path, offset: focusOffset + 1 },
        };

        highlightText(suggestion, range);
      }

      acc.push({
        id: suggestion.id,
        suggestedText,
        incorrectText,
        path: suggestion.path,
      });

      return acc;
    }, [] as Highlighted[]);

    const highlightedNewRange: HighlightedNewRange[] = highlighted
      .reverse()
      .map(findHighlightedNewRange);

    return highlightedNewRange;
  };

  const findHighlightedNewRange = (highlighted: Highlighted) => {
    const { incorrectText, path, suggestedText, id } = highlighted;

    const [parentNode, parentPath] = editor.parent(path);

    const childNewIndex = parentNode.children.findIndex((node) => {
      return Text.isText(node) && node.text === incorrectText;
    });

    const newPath = [...parentPath, childNewIndex];

    return {
      id,
      suggestedText,
      incorrectText,
      parentText: Node.string(parentNode),
      range: {
        anchor: { path: newPath, offset: 0 },
        focus: {
          path: newPath,
          offset: suggestedText.length,
        },
      },
    };
  };

  const highlightText = (suggestion: Suggestion, range: Range) => {
    const currentSelection = editor.selection ? { ...editor.selection } : null;

    try {
      editor.select(range);

      editor.addMark("highlight", true);
      editor.addMark("id", suggestion.id);

      editor.deselect();
    } catch (e) {
      console.error(`Unable to highlight: "${suggestion.text}"`);
    }

    if (currentSelection) editor.select(currentSelection);
  };

  const parseSuggestion = (
    highlighted: HighlightedNewRange,
    suggestion: Suggestion
  ) => {
    const { parentText, incorrectText, suggestedText, range } = highlighted;

    const incorrectRange = findIndexRanges(parentText, incorrectText);
    const [from, to] = incorrectRange[0] as number[];

    return {
      id: suggestion.id,
      range,
      incorrectText,
      correctLeft: parentText.substring(0, from),
      correctRight: parentText.substring(to + 1),
      suggestedText,
    };
  };

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

    setSuggestionMap((current) => {
      const currentMap = new Map([...current]);
      currentMap.delete(id);
      return currentMap;
    });
  };

  const removeHighlightOnTextChange = (
    { id, text }: HighlightedText,
    path: Path
  ) => {
    const suggestion = suggestionMap.get(id!);

    if (!suggestion || suggestion.incorrectText === text) return [];

    return [
      {
        anchor: { path, offset: 0 },
        focus: { path, offset: text.length },
        highlight: false,
      },
    ];
  };

  const decorateEditor = ([node, path]: NodeEntry) => {
    if (editor.isHighlightedText(node) && editor.selection) {
      return removeHighlightOnTextChange(node, path);
    }

    return [];
  };

  return (
    <main className={classNames("page", styles.grammar)}>
      <GrammarContext.Provider value={{ onApplySuggestion, onRemoveHighlight }}>
        <GrammarRichTextEditor
          editor={editor}
          decorate={decorateEditor}
          className={styles.grammarEditor}
          onHighlightTextClick={(id) => setExpandSuggestionId(id)}
        />
        <GrammarSuggestionList
          activeId={expandSuggestionId}
          suggestionMap={suggestionMap}
          className={styles.grammarSuggestionList}
        />
      </GrammarContext.Provider>
    </main>
  );
};

export default Grammar;
