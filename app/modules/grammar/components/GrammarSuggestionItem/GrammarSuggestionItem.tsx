import {
  ForwardedRef,
  MouseEventHandler,
  forwardRef,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import { Button } from "~/components/Button";
import { GrammarSuggestionItemDesc } from "../GrammarSuggestionItemDesc";

import styles from "./GrammarSuggestionItem.module.sass";
import {
  GrammarSuggestionItemActionsProps,
  GrammarSuggestionItemProps,
} from ".";

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

const GrammarSuggestionItem = ({
  data,
  className,
}: GrammarSuggestionItemProps) => {
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
        <span>{data.incorrectText}</span>
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
            <GrammarSuggestionItemDesc content={data.suggestionContent} />
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
