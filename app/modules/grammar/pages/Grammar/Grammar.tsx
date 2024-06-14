import classNames from "classnames";

import { RichtextEditor } from "~/components/RichtextEditor";

import styles from "./Grammar.module.sass";

const Grammar = () => (
  <main className={classNames("page", styles.grammar)}>
    <RichtextEditor
      className={styles.grammarEditor}
      placeholder="Type or paste your text here"
    />
  </main>
);

export default Grammar;
