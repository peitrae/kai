import { HTMLAttributes, PropsWithChildren } from "react";

export interface AccordionProviderProps extends PropsWithChildren {
  activeId?: string;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  activeId?: string;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export interface AccordionButtonProps
  extends HTMLAttributes<HTMLButtonElement> {}

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {}
