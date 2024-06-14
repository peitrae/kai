import { CSSProperties, useCallback, useEffect, useState } from "react";
import {
  BaseEditor,
  Descendant,
  Editor,
  createEditor,
  Element as SlateElement,
  Transforms,
} from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";

import debounce from "~/utils/debounce";

import styles from "./RichtextEditor.module.sass";
import { RichtextButtonProps, RichtextEditorProps } from ".";
import {
  BsJustify,
  BsJustifyLeft,
  BsJustifyRight,
  BsListOl,
  BsListUl,
  BsTextCenter,
  BsTypeBold,
  BsTypeH1,
  BsTypeH2,
  BsTypeItalic,
  BsTypeUnderline,
} from "react-icons/bs";
import classNames from "classnames";
import { withHistory } from "slate-history";
import { withHtml } from "./RichtextEditor.utils";

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor);

  return marks ? marks[format as keyof typeof marks] === true : false;
};

const isBlockActive = (
  editor: BaseEditor,
  format: string,
  blockType: "align" | "type" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        node[blockType] === format,
    })
  );

  return !!match;
};

const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const toggleBlock = (editor: BaseEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      typeof node.type === "string" &&
      LIST_TYPES.includes(node.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const RichtextMarkButton = ({ format, icon: Icon }: RichtextButtonProps) => {
  const editor = useSlate();

  return (
    <button
      className={classNames(
        styles.markButton,
        isMarkActive(editor, format) && styles.active
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon />
    </button>
  );
};

const RichtextBlockButton = ({ format, icon: Icon }: RichtextButtonProps) => {
  const editor = useSlate();
  return (
    <button
      className={classNames(
        styles.blockButton,
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        ) && styles.active
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon />
    </button>
  );
};

const RichtextToolbar = () => (
  <div className={styles.toolbar}>
    <RichtextMarkButton format="bold" icon={BsTypeBold} />
    <RichtextMarkButton format="italic" icon={BsTypeItalic} />
    <RichtextMarkButton format="underline" icon={BsTypeUnderline} />
    <RichtextBlockButton format="heading-one" icon={BsTypeH1} />
    <RichtextBlockButton format="heading-two" icon={BsTypeH2} />
    <RichtextBlockButton format="numbered-list" icon={BsListOl} />
    <RichtextBlockButton format="bulleted-list" icon={BsListUl} />
    <RichtextBlockButton format="left" icon={BsJustifyLeft} />
    <RichtextBlockButton format="center" icon={BsTextCenter} />
    <RichtextBlockButton format="right" icon={BsJustifyRight} />
    <RichtextBlockButton format="justify" icon={BsJustify} />
  </div>
);

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: CSSProperties = { textAlign: element.align };

  switch (element.type) {
    case "bulleted-list":
      return (
        <ul className={styles.ul} style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 className={styles.h1} style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 className={styles.h2} style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li className={styles.li} style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol className={styles.ol} style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p className={styles.p} style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) <u>{children}</u>;

  return <span {...attributes}>{children}</span>;
};

const initial = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const RichtextEditor = ({
  initialValue = initial,
  placeholder,
}: RichtextEditorProps) => {
  const [editor] = useState(() =>
    withHtml(withReact(withHistory(createEditor())))
  );
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  useEffect(() => ReactEditor.focus(editor), []);

  const onEditorChange = debounce((values: Descendant[]) => {
    console.log("Value: ", values);
  }, 1000);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={onEditorChange}
    >
      <RichtextToolbar />
      <Editable
        className={styles.editor}
        placeholder={placeholder}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
};

export default RichtextEditor;
