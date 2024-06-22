import { Descendant } from "slate";
import { IconType } from "react-icons";
import { EditableProps } from "slate-react/dist/components/editable";

import { GrammarEditor } from "~/modules/grammar/pages/Grammar";

export interface RichTextEditorProps extends Omit<EditableProps, "onChange"> {
  editor: GrammarEditor;
  initialValue?: Descendant[];
  onChange?: (value: Descendant[]) => void;
  onValueChange?: (value: Descendant[]) => void;
}

export interface RichTextButtonProps {
  format: string;
  icon: IconType;
}
