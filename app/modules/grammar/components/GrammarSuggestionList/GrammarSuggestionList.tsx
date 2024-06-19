import classNames from "classnames";

import { GrammarSuggestionItem } from "../GrammarSuggestionItem";

import styles from "./GrammarSuggestionList.module.sass";
import { GrammarSuggestionListProps } from ".";
import { Accordion } from "~/components/Accordion";
import { range } from "slate";

const GrammarSuggestionList = ({
  list,
  className,
}: GrammarSuggestionListProps) => {
  return (
    <section className={classNames(styles.container, className)}>
      <header className={styles.header}>
        <h2 className={styles.title}>Suggestion List</h2>
        <span className={styles.suggestionAmount}>{list.length}</span>
      </header>
      <Accordion className={styles.accordion}>
        {list.map((suggestion) => (
          <GrammarSuggestionItem
            key={suggestion.id}
            id={suggestion.id}
            range={suggestion.range}
            content={suggestion.content}
          />
        ))}
      </Accordion>
    </section>
  );
};

export default GrammarSuggestionList;
