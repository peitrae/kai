import { ForwardedRef, forwardRef } from "react";

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

const GrammarSuggestionItem = ({ data }: GrammarSuggestionItemProps) => {
  const { activeId } = useAccordion();

  const apply = () => console.log("Apply!");

  const ignore = () => console.log("Ignore!");

  return (
    <AccordionItem id={data.id} className={styles.container}>
      <AccordionButton className={styles.summary}>
        {activeId === data.id ? (
          <GrammarSuggestionItemDesc content={data.suggestionContent} />
        ) : (
          <>
            <span className={styles.title}>{data.incorrectText}</span>
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
