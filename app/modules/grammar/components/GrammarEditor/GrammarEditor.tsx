import { useFetcher } from "@remix-run/react";
import { Descendant, Element, Path, Text } from "slate";
import { ReactEditor } from "slate-react";

import {
  RichtextEditor,
  RichtextEditorProps,
} from "~/components/RichtextEditor";
import debounce from "~/utils/debounce";
import { Suggestion } from "../../controller";

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

const GrammarEditor = ({ editor, className }: RichtextEditorProps) => {
  const fetcher = useFetcher<Suggestion[]>({ key: "grammar" });

  const addTextIdentifier = (nodes: Descendant[], parentPath: Path = []) => {
    return nodes.map((node, index) => {
      const newNode = { ...node };
      const currentPath = [...parentPath, index];

      if (Text.isText(newNode)) {
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
    <RichtextEditor
      editor={editor}
      initialValue={initialValue}
      className={className}
      placeholder="Type or paste your text here"
      onValueChange={onEditorChange}
    />
  );
};

export default GrammarEditor;
