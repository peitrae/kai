import { BaseRange, Descendant, NodeEntry } from "slate";
import { ReactEditor } from "slate-react";
import { IconType } from "react-icons";

export interface OnChangeRichtextEditorParams {
  editor: ReactEditor;
  value: Descendant[];
}

export interface RichtextEditorProps {
  initialValue?: Descendant[];
  placeholder?: string;
  className?: string;
  decorate?: (entry: NodeEntry) => BaseRange[];
  onChange?: (params: OnChangeRichtextEditorParams) => void;
  onValueChange?: (params: OnChangeRichtextEditorParams) => void;
}

export interface RichtextButtonProps {
  format: string;
  icon: IconType;
}
