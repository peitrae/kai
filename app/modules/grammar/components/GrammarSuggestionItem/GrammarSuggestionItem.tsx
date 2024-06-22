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

const GrammarSuggestionItemActions = ({
  onApply,
  onIgnore,
  disabled,
}: GrammarSuggestionItemActionsProps) => (
  <div className={styles.actions}>
    <Button size="sm" disabled={disabled} onClick={onApply}>
      Apply
    </Button>
    <Button
      className={styles.btnIgnore}
      size="sm"
      variant="text"
      color="neutral"
      onClick={onIgnore}
      disabled={disabled}
    >
      Ignore
    </Button>
  </div>
);

const GrammarSuggestionItem = ({
  id,
  data,
  isLoading,
}: GrammarSuggestionItemProps) => {
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
            <GrammarSuggestionItemActions
              onApply={apply}
              onIgnore={ignore}
              disabled={isLoading}
            />
          </>
        )}
      </AccordionButton>
      <AccordionPanel>
        <GrammarSuggestionItemActions
          onApply={apply}
          onIgnore={ignore}
          disabled={isLoading}
        />
      </AccordionPanel>
    </AccordionItem>
  );
};

GrammarSuggestionItemActions.displayName = "GrammarSuggestionItemActions";

export default GrammarSuggestionItem;
