import { MouseEventHandler } from "react";

import {
  AccordionProvider,
  AccordionItemProvider,
  AccordionItemProps,
  useAccordionItem,
  AccordionPanelProps,
  AccordionButtonProps,
  AccordionProps,
} from ".";

import styles from "./Accordion.module.sass";
import classNames from "classnames";

export const AccordionPanel = ({
  children,
  className,
}: AccordionPanelProps) => {
  const { isOpen } = useAccordionItem();

  return (
    isOpen && (
      <div className={classNames(styles.accordionPanel, className)}>
        {children}
      </div>
    )
  );
};

export const AccordionButton = ({
  children,
  className,
}: AccordionButtonProps) => {
  const { isOpen, toggleOpen } = useAccordionItem();

  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    const buttonEl = event.target as HTMLDivElement;

    if (buttonEl.tagName === "BUTTON") {
      return;
    }

    toggleOpen();
  };

  return (
    <div
      role="presentation"
      className={classNames(
        styles.accordionButton,
        { [styles["isOpen"]]: isOpen },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const AccordionItem = ({
  children,
  id,
  className,
}: AccordionItemProps) => {
  return (
    <div className={classNames(styles.accordionItem, className)}>
      <AccordionItemProvider id={id}>{children}</AccordionItemProvider>
    </div>
  );
};

const Accordion = ({ children, className }: AccordionProps) => {
  return (
    <div className={classNames(styles.accordion, className)}>
      <AccordionProvider>{children}</AccordionProvider>
    </div>
  );
};

export default Accordion;
