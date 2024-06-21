import { createContext, useContext, useEffect, useState } from "react";
import { AccordionProviderProps } from "./Accordion.types";

const AccordionContext = createContext({});

// TODO: Change any to specific type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAccordion = () => useContext<any>(AccordionContext);

export const AccordionProvider = ({
  activeId = undefined,
  children,
}: AccordionProviderProps) => {
  const [currentActiveId, setCurrentActiveId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!activeId) return;

    setCurrentActiveId(activeId);
  }, [activeId]);

  const toggleActiveId = (id: string) => {
    setCurrentActiveId(currentActiveId === id ? undefined : id);
  };

  return (
    <AccordionContext.Provider
      value={{ activeId: currentActiveId, toggleActiveId }}
    >
      {children}
    </AccordionContext.Provider>
  );
};
