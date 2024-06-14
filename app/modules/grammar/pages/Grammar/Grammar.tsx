import classNames from "classnames";

import { RichtextEditor } from "~/components/RichtextEditor";

import styles from "./Grammar.module.sass";
import debounce from "~/utils/debounce";
import { Descendant } from "slate";

const Grammar = () => {
  const onEditorChange = debounce((values: Descendant[]) => {
    console.log(values);
  }, 1000);

  return (
    <main className={classNames("page", styles.grammar)}>
      <RichtextEditor
        className={styles.grammarEditor}
        placeholder="Type or paste your text here"
        onChange={onEditorChange}
      />
    </main>
  );
};

export default Grammar;
