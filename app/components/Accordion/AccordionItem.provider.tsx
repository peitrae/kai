import { createContext, useContext } from "react";

import { AccordionItemProps, useAccordion } from ".";

const AccordionItemContext = createContext({
  isOpen: false,
  toggleOpen: () => {},
});

export const useAccordionItem = () => useContext(AccordionItemContext);

export const AccordionItemProvider = ({ children, id }: AccordionItemProps) => {
  const { activeId, toggleActiveId } = useAccordion();

  const toggleOpen = () => toggleActiveId(id);

  return (
    <AccordionItemContext.Provider
      value={{ isOpen: id === activeId, toggleOpen }}
    >
      {children}
    </AccordionItemContext.Provider>
  );
};
