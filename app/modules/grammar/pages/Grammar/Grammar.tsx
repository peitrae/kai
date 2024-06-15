import { useCallback, useState } from "react";
import classNames from "classnames";
import { Descendant, NodeEntry } from "slate";

import debounce from "~/utils/debounce";
import { RichtextEditor } from "~/components/RichtextEditor";
import { highlightSuggestedWords } from "./Grammar.utils";

import styles from "./Grammar.module.sass";

const correctValue = [
  { text: "She doesn't like apples.", path: [0, 0] },
  { text: "Him or I went to the store.", path: [2, 0] },
];

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "She don't like apples" }],
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

  const onEditorChange = debounce((values: Descendant[]) => {
    console.log("values: ", values);
  }, 1000);

  const decorate = useCallback(([node, path]: NodeEntry) => {
    const highligtedRanges = highlightSuggestedWords([node, path], suggestions);

    return highligtedRanges;
  }, []);

  return (
    <main className={classNames("page", styles.grammar)}>
      <RichtextEditor
        className={styles.grammarEditor}
        placeholder="Type or paste your text here"
        initialValue={initialValue}
        decorate={decorate}
        onChange={onEditorChange}
      />
    </main>
  );
};

export default Grammar;
