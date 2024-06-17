import styles from "./GrammarSuggestionItemDesc.module.sass";
import { GrammarSuggestionDescProps } from ".";

const GrammarSuggestionItemDesc = ({ content }: GrammarSuggestionDescProps) => (
  <div className={styles.container}>
    <span>{content.correctLeft}</span>
    <span className={styles.incorrectMark}>{content.incorrectText}</span>
    <span className={styles.suggestedMark}> {content.suggestedText}</span>
    <span>{content.correctRight}</span>
  </div>
);

export default GrammarSuggestionItemDesc;
