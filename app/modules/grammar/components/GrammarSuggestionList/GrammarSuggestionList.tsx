import classNames from "classnames";

import { GrammarSuggestionItem } from "../GrammarSuggestionItem";

import styles from "./GrammarSuggestionList.module.sass";
import { GrammarSuggestionListProps } from ".";

const GrammarSuggestionList = ({ className }: GrammarSuggestionListProps) => {
  return (
    <section className={classNames(styles.container, className)}>
      <header className={styles.header}>
        <h2 className={styles.title}>Suggestion List</h2>
        <span className={styles.suggestionAmount}>4</span>
      </header>
      <ul className={styles.list}>
        <GrammarSuggestionItem />
      </ul>
    </section>
  );
};

export default GrammarSuggestionList;
