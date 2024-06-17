import { PropsWithChildren, createContext, useContext, useState } from "react";

const AccordionContext = createContext({});

// TODO: Change any to specific type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAccordion = () => useContext<any>(AccordionContext);

export const AccordionProvider = ({ children }: PropsWithChildren) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleActiveId = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <AccordionContext.Provider value={{ activeId, toggleActiveId }}>
      {children}
    </AccordionContext.Provider>
  );
};
