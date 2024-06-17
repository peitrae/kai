import {
  ForwardedRef,
  MouseEventHandler,
  forwardRef,
  useRef,
  useState,
} from "react";

import { Button } from "~/components/Button";

import styles from "./GrammarSuggestionItem.module.sass";
import {
  GrammarSuggestionItemActionsProps,
  GrammarSuggestionItemProps,
} from ".";
import classNames from "classnames";

const GrammarSuggestionItemActions = forwardRef(
  (
    { onApply, onIgnore }: GrammarSuggestionItemActionsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <div ref={ref} className={styles.actions}>
      <Button size="sm" onClick={onApply}>
        Apply
      </Button>
      <Button
        className={styles.btnIgnore}
        size="sm"
        variant="text"
        color="neutral"
        onClick={onIgnore}
      >
        Ignore
      </Button>
    </div>
  )
);

const GrammarSuggestionItem = ({ className }: GrammarSuggestionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const actionRef = useRef(null);

  const toggleExpand: MouseEventHandler<HTMLLIElement> = (event) => {
    const element = event.target as HTMLLIElement;

    if (element.tagName === "BUTTON") return;

    setIsExpanded(!isExpanded);
  };

  const apply = () => console.log("Apply!");

  const ignore = () => console.log("Ignore!");

  return (
    <li
      role="presentation"
      className={classNames(styles.container, className)}
      onClick={toggleExpand}
    >
      <div className={styles.summary}>
        <span>Hello</span>
        {!isExpanded && (
          <GrammarSuggestionItemActions
            ref={actionRef}
            onApply={apply}
            onIgnore={ignore}
          />
        )}
      </div>
      {isExpanded && (
        <div className={styles.full}>
          <span className={styles.fullText}>
            <span className={styles.incorrectMark}> Experts</span>
            <span className={styles.suggestedMark}> Xperts does</span> believe
            <span className={styles.incorrectMark}> industrial</span>{" "}
            development
            <span className={styles.incorrectMark}> will help the</span>
            <span className={styles.suggestedMark}> that wont</span> economy.
          </span>
          <GrammarSuggestionItemActions
            ref={actionRef}
            onApply={apply}
            onIgnore={ignore}
          />
        </div>
      )}
    </li>
  );
};

GrammarSuggestionItemActions.displayName = "GrammarSuggestionItemActions";

export default GrammarSuggestionItem;
