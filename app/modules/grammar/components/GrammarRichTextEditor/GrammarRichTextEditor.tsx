import { useFetcher } from "@remix-run/react";
import { Descendant, Element, Path } from "slate";
import { ReactEditor, RenderLeafProps } from "slate-react";

import { RichTextEditor, RichTextLeaf } from "~/components/RichTextEditor";
import debounce from "~/utils/debounce";
import { Suggestion } from "../../controller";
import { HighlightedText } from "../../pages/Grammar";

import styles from "./GrammarRichTextEditor.module.sass";
import { GrammarRichTextEditorProps, RenderGrammarLeafProps } from ".";

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "She don't like apples.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "The book on the table is mine",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Him and I ",
        bold: true,
      },
      {
        text: "went",
        italic: true,
      },
      {
        text: " to the stare.",
      },
    ],
  },
];

const GrammarEditorLeaf = ({
  children,
  leaf,
  onHighlightTextClick,
  ...params
}: RenderGrammarLeafProps) => {
  const l = leaf as HighlightedText;

  if (l.highlight && l.id)
    children = (
      <span
        role="presentation"
        className={styles.highlight}
        onClick={() => onHighlightTextClick(l.id)}
      >
        {children}
      </span>
    );

  return RichTextLeaf({ children, leaf, ...params });
};

const GrammarRichTextEditor = ({
  editor,
  decorate,
  className,
  onHighlightTextClick,
}: GrammarRichTextEditorProps) => {
  const fetcher = useFetcher<Suggestion[]>({ key: "grammar" });

  const renderLeaf = (props: RenderLeafProps) => (
    <GrammarEditorLeaf onHighlightTextClick={onHighlightTextClick} {...props} />
  );

  const addTextIdentifier = (nodes: Descendant[], parentPath: Path = []) => {
    return nodes.map((node, index) => {
      const newNode = { ...node };
      const currentPath = [...parentPath, index];

      if (editor.isHighlightedText(newNode)) {
        const key = ReactEditor.findKey(editor, node);
        newNode.path = currentPath;
        newNode.id = key.id;
      }

      if (Element.isElement(newNode) && Element.isElement(node)) {
        newNode.children = addTextIdentifier(node.children, currentPath);
      }

      return newNode;
    });
  };

  const onEditorChange = debounce((value: Descendant[]) => {
    const body = addTextIdentifier(value);

    fetcher.submit(JSON.stringify(body), {
      method: "post",
      encType: "application/json",
    });
  }, 500);

  return (
    <RichTextEditor
      editor={editor}
      initialValue={initialValue}
      className={className}
      decorate={decorate}
      placeholder="Type or paste your text here"
      onValueChange={onEditorChange}
      renderLeaf={renderLeaf}
    />
  );
};

export default GrammarRichTextEditor;
