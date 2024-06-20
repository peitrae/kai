import { ForwardedRef, forwardRef, useContext } from "react";

import { Button } from "~/components/Button";
import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  useAccordion,
} from "~/components/Accordion";
import { GrammarSuggestionItemDesc } from "../GrammarSuggestionItemDesc";

import styles from "./GrammarSuggestionItem.module.sass";
import {
  GrammarSuggestionItemActionsProps,
  GrammarSuggestionItemProps,
} from ".";
import { GrammarContext, GrammarContextValue } from "../../pages/Grammar";

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

const GrammarSuggestionItem = ({ id, data }: GrammarSuggestionItemProps) => {
  const { range, suggestedText, incorrectText } = data;
  const { activeId } = useAccordion();
  const { onApplySuggestion, onRemoveHighlight } = useContext(
    GrammarContext
  ) as GrammarContextValue;

  const apply = () =>
    onApplySuggestion({
      id,
      suggestedText,
      range,
    });

  const ignore = () => onRemoveHighlight({ id, range });

  return (
    <AccordionItem id={id} className={styles.container}>
      <AccordionButton className={styles.summary}>
        {activeId === id ? (
          <GrammarSuggestionItemDesc content={data} />
        ) : (
          <>
            <span className={styles.title}>{incorrectText}</span>
            <GrammarSuggestionItemActions onApply={apply} onIgnore={ignore} />
          </>
        )}
      </AccordionButton>
      <AccordionPanel>
        <GrammarSuggestionItemActions onApply={apply} onIgnore={ignore} />
      </AccordionPanel>
    </AccordionItem>
  );
};

GrammarSuggestionItemActions.displayName = "GrammarSuggestionItemActions";

export default GrammarSuggestionItem;
