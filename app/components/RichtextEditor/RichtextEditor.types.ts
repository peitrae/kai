import { BaseRange, Descendant, NodeEntry } from "slate";
import { ReactEditor } from "slate-react";
import { IconType } from "react-icons";

export interface RichtextEditorProps {
  editor: ReactEditor;
  initialValue?: Descendant[];
  placeholder?: string;
  className?: string;
  decorate?: (entry: NodeEntry) => BaseRange[];
  onChange?: (value: Descendant[]) => void;
  onValueChange?: (value: Descendant[]) => void;
}

export interface RichtextButtonProps {
  format: string;
  icon: IconType;
}
