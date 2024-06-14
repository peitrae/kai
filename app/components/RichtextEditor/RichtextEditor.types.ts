import { IconType } from "react-icons";
import { Descendant } from "slate";

export interface RichtextEditorProps {
  initialValue?: Descendant[];
  placeholder?: string;
  className?: string;
}

export interface RichtextButtonProps {
  format: string;
  icon: IconType;
}
