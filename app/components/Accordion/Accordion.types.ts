import { HTMLAttributes } from "react";

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export interface AccordionButtonProps
  extends HTMLAttributes<HTMLButtonElement> {}

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {}
