import classNames from "classnames";

import { GrammarSuggestionItem } from "../GrammarSuggestionItem";

import styles from "./GrammarSuggestionList.module.sass";
import { GrammarSuggestionListProps } from ".";
import { Accordion } from "~/components/Accordion";
import { Loader } from "~/components/Loader";

const GrammarSuggestionList = ({
  activeId,
  suggestionMap,
  className,
  isLoading,
}: GrammarSuggestionListProps) => {
  return (
    <section className={classNames(styles.container, className)}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Suggestion List</h2>
          {!isLoading && (
            <span className={styles.suggestionAmount}>
              {suggestionMap.size}
            </span>
          )}
        </div>
        {isLoading && <Loader className={styles.headerLoader} />}
      </header>
      <Accordion activeId={activeId} className={styles.accordion}>
        {Array.from(suggestionMap).map(([id, suggestion]) => (
          <GrammarSuggestionItem
            key={id}
            id={id}
            data={suggestion}
            isLoading={isLoading}
          />
        ))}
      </Accordion>
    </section>
  );
};

export default GrammarSuggestionList;
