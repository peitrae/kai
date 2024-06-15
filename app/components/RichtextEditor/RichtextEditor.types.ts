import { BaseRange, Descendant, NodeEntry } from "slate";
import { IconType } from "react-icons";

export interface RichtextEditorProps {
  initialValue?: Descendant[];
  placeholder?: string;
  className?: string;
  decorate?: (entry: NodeEntry) => BaseRange[];
  onChange?: (value: Descendant[]) => void;
}

export interface RichtextButtonProps {
  format: string;
  icon: IconType;
}
