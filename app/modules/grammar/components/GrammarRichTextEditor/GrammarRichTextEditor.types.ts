import { RenderLeafProps } from "slate-react";
import { RichTextEditorProps } from "~/components/RichTextEditor";

export interface GrammarRichTextEditorProps extends RichTextEditorProps {
  onHighlightTextClick: (id: string) => void;
}

export interface RenderGrammarLeafProps extends RenderLeafProps {
  onHighlightTextClick: (id: string) => void;
}
