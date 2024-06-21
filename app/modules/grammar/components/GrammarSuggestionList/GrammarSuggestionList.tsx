import classNames from "classnames";

import { GrammarSuggestionItem } from "../GrammarSuggestionItem";

import styles from "./GrammarSuggestionList.module.sass";
import { GrammarSuggestionListProps } from ".";
import { Accordion } from "~/components/Accordion";

const GrammarSuggestionList = ({
  activeId,
  suggestionMap,
  className,
}: GrammarSuggestionListProps) => {
  return (
    <section className={classNames(styles.container, className)}>
      <header className={styles.header}>
        <h2 className={styles.title}>Suggestion List</h2>
        <span className={styles.suggestionAmount}>{suggestionMap.size}</span>
      </header>
      <Accordion activeId={activeId} className={styles.accordion}>
        {Array.from(suggestionMap).map(([id, suggestion]) => (
          <GrammarSuggestionItem key={id} id={id} data={suggestion} />
        ))}
      </Accordion>
    </section>
  );
};

export default GrammarSuggestionList;
